package local.servlet;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.lang.reflect.Field;
import java.net.Authenticator;
import java.net.HttpURLConnection;
/*import java.net.InetAddress;*/
import java.net.ProtocolException;
import java.net.URI;
import java.net.URL;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Servlet implementation class SimpleServlet
 */
public class SimpleServlet extends HttpServlet {
    /** serial version UID */
    private static final long serialVersionUID = 1220182758271730914L;

    /** buffer size for piping the content */
    private static final int IO_BUFFER_SIZE = 4 * 1024;

    /** parameter for configuring the remote location */
    private static final String PARAM_REMOTE_LOCATION = "com.sap.ui5.proxy.REMOTE_LOCATION";

    /** reference to the logger */
    private Logger log;

    /** headers which will be blocked from forwarding by request */
    private String[] BLOCKED_REQUEST_HEADERS = { "host", "referer" };

    /** original authenticator (used in Eclipse to store the authenticator) */
    private Authenticator origAuthenticator = null;

    /** base URI of the remote location */
    private String baseUri = null;

    /*
    * (non-Javadoc)
    * 
     * @see javax.servlet.GenericServlet#init(javax.servlet.ServletConfig)
    */
    public void init(ServletConfig servletConfig) throws ServletException {
            super.init(servletConfig);

            this.log = Logger.getLogger(SimpleServlet.class.getName());

            // extract the original authenticator via reflection (evil!!)
            try {
                     Field f = Authenticator.class.getDeclaredField("theAuthenticator");
                     boolean isAccessible = f.isAccessible();
                     f.setAccessible(true);
                     this.origAuthenticator = (Authenticator) f.get(null);
                     f.setAccessible(isAccessible);
            } catch (Exception ex) {
                     this.origAuthenticator = null;
            }

            // read the base uri from the configuration and validate the uri
            try {
                     this.baseUri = servletConfig
                                       .getInitParameter(PARAM_REMOTE_LOCATION);
                     if (this.baseUri == null) {
                              this.baseUri = servletConfig.getServletContext()
                                               .getInitParameter(PARAM_REMOTE_LOCATION);
                     }
                     if (this.baseUri != null) {
                              URI.create(this.baseUri);
                     }
            } catch (IllegalArgumentException ex) {
                     this.log.log(
                                       Level.SEVERE,
                                       "URI in context parameter com.sap.ui5.proxy.REMOTE_LOCATION is not valid!",
                                       ex);
                     this.baseUri = null;
            }

    } // method: init

    /*
    * (non-Javadoc)
    * 
     * @see
    * javax.servlet.http.HttpServlet#service(javax.servlet.http.HttpServletRequest
    * , javax.servlet.http.HttpServletResponse)
    */
    @SuppressWarnings("rawtypes")
    protected void service(HttpServletRequest request,
                     HttpServletResponse response) throws ServletException, IOException {

            // incoming request: <servlet_path>/<protocol>/<url>?<query>
            // e.g.: <servlet_path>/https/odata.microsoft.com/northwind?param=value

            // request dispatching is not allowed for non localhost request
            // to prevent the security problems of such a generic proxy
            /*
            * InetAddress localAddr =
            * InetAddress.getByName(request.getLocalAddr()); InetAddress remoteAddr
            * = InetAddress.getByName(request.getRemoteAddr()); boolean
            * bIsLocalAddrLocal = localAddr.isLinkLocalAddress() ||
            * localAddr.isAnyLocalAddress() || localAddr.isLoopbackAddress();
            * boolean bIsRemoteAddrLocal = remoteAddr.isLinkLocalAddress() ||
            * remoteAddr.isAnyLocalAddress() || remoteAddr.isLoopbackAddress(); if
            * (!(bIsLocalAddrLocal && bIsRemoteAddrLocal)) {
            * response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
            * "Only allowed for local testing!"); return; }
            */

            // process the request
            String method = request.getMethod();
            // String pathInfo = request.getPathInfo(); // getPathInfo decodes the
            // URL!
            String pathInfo = request.getRequestURI().substring(
                              request.getContextPath().length()
                                               + request.getServletPath().length());
            String queryString = request.getQueryString();

            StringBuffer infoLog = new StringBuffer();
            infoLog.append(method).append(" ").append(request.getRequestURL());

            // create the targetUri
            String targetUriString = null;
            if (pathInfo.indexOf("/") != -1) {
                     // either use the base URI or convert the pathinfo (containing the
                     // full URL)
                     if (this.baseUri != null) {
                              targetUriString = this.baseUri;
                              targetUriString += pathInfo;
                     } else {
                              targetUriString = pathInfo.substring(1,
                                               pathInfo.indexOf("/", 1));
                              targetUriString += "://";
                              targetUriString += pathInfo
                                               .substring(pathInfo.indexOf("/", 1) + 1);
                     }
                     // make sure to replace spaces with %20 in the path
                     targetUriString = targetUriString.replace(" ", "%20");
                     if (queryString != null && !queryString.isEmpty()) {
                              targetUriString += "?";
                              targetUriString += queryString;
                     }
            }

            // only a valid targetUriString will work
            if (targetUriString != null) {

                     // check the targetUriString
                     URL targetUrl = new URL(targetUriString);
                     infoLog.append("\n").append("  - target: ")
                                       .append(targetUrl.toString());

                     // create a new URL connection (the proxy settings defined via
                     // system properties are used):
                     // - HTTP: http.proxyHost, http.proxyPort, http.proxyByPass
                     // - HTTPS: https.proxyHost, https.proxyPort, https.proxyByPass
                     HttpURLConnection conn = (HttpURLConnection) new URL(
                                       targetUriString).openConnection();
                     conn.setRequestMethod(method);
                     conn.setDoOutput(true);
                     conn.setDoInput(true);
                     conn.setUseCaches(false);

                     // copy all headers from this to the outgoing request to the target
                     // URI
                     // except the blocked headers, which will be covered differently
                     infoLog.append("\n").append("  - request headers:");
                     List<String> blockedHeaders = Arrays
                                       .asList(BLOCKED_REQUEST_HEADERS);
                     for (Enumeration e = request.getHeaderNames(); e.hasMoreElements();) {
                              String headerName = e.nextElement().toString();
                              if (!blockedHeaders.contains(headerName.toLowerCase())) {
                                       conn.setRequestProperty(headerName,
                                                        request.getHeader(headerName));
                                       infoLog.append("\n").append("    => ").append(headerName)
                                                        .append(": ").append(request.getHeader(headerName));
                              }
                     }

                     // set the host header to the host url from the target server
                     String host = request.getHeader("host");
                     if (host != null) {
                              if (targetUrl.getPort() > -1) {
                                       conn.setRequestProperty("host", targetUrl.getHost() + ":"
                                                        + targetUrl.getPort());
                              } else {
                                       conn.setRequestProperty("host", targetUrl.getHost());
                              }
                     }

                     // connect to the target URL
                     conn.connect();

                     // pipe the POST and PUT content
                     if ("POST".equals(method) || "PUT".equals(method)) {
                              pipe(request.getInputStream(), conn.getOutputStream());
                     }

                     // special handling for DELETE requests (HttpUrlConnection doesn't
                     // support content)
                     // pipe the DELETE content if possible (and only if content is
                     // available)
                     if ("DELETE".equals(method) && request.getContentLength() > -1) {
                              try {
                                       pipe(request.getInputStream(), conn.getOutputStream());
                              } catch (ProtocolException ex) {
                                       response.sendError(
                                                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                                                        "The HttpUrlConnection used by the SimpleProxyServlet doesn't allow to send content with the HTTP method DELETE. Due to spec having content for DELETE methods is possible but the default implementation of the HttpUrlConnection from SUN doesn't allow this!");
                                       return;
                              }
                     }

                     // apply the status of the response
                     if (this.origAuthenticator == null) {
                              response.setStatus(conn.getResponseCode());
                     } else {
                             // in case of having an original authenticator we just reset the
                              // authenticator and add it again after fetching the response.
                              // in case of Eclipse this prevents the BASIC auth popup!
                              synchronized (this.origAuthenticator) {
                                       Authenticator.setDefault(null);
                                       response.setStatus(conn.getResponseCode());
                                       Authenticator.setDefault(this.origAuthenticator);
                              }
                     }
                     infoLog.append("\n").append(" - response-status: ")
                                       .append(conn.getResponseCode());

                     // forward the response headers
                     File file = new File("C:/Users/I069066/Test.csv");

                     if (file.exists()) {
                              System.out.println("Success with existence 2");
                              
                              PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(file,true))) ;
                              /*fw.append(targetUrl.toString());
                              fw.append(",");
                              fw.append((String.valueOf(Calendar.getInstance().getTime())));
                              fw.close();*/
                              out.print(targetUrl.toString());
                              out.print(",");
                              out.println((String.valueOf(Calendar.getInstance().getTime())));
                              out.close();
                     } else {

                              System.out.println("Failure!");
                     }

                     infoLog.append("\n").append("  - response headers:");
                     for (Map.Entry<String, List<String>> mapEntry : conn
                                       .getHeaderFields().entrySet()) {
                              String name = mapEntry.getKey();
                              if (name != null) {
                                       List<String> values = mapEntry.getValue();
                                       if (values != null) {
                                               for (String value : values) {
                                                        // we always filter the secure header to avoid the
                                                        // cookie from
                                                        // "not" beeing included in follow up requests in
                                                        // case of the
                                                        // proxy is running on HTTP and not HTTPS
                                                        if (value != null
                                                                          && "set-cookie".equalsIgnoreCase(name)
                                                                          && value.toLowerCase().contains("secure")) {
                                                                 String[] cookieValues = value.split(";");
                                                                 String newValue = "";
                                                                 for (String cookieValue : cookieValues) {
                                                                          if (!"secure".equalsIgnoreCase(cookieValue
                                                                                           .trim())) {
                                                                                  if (!newValue.isEmpty()) {
                                                                                           newValue += "; ";
                                                                                  }
                                                                                  newValue += cookieValue;
                                                                          }
                                                                 }
                                                                 value = newValue;
                                                        }
                                                        response.addHeader(name, value);
                                                        infoLog.append("\n").append("    => ").append(name)
                                                                          .append(": ").append(value);
                                               }
                                       }
                              }
                     }

                     // pipe and return the response (either the input or the error
                     // stream)
                     try {
                              pipe(conn.getInputStream(), response.getOutputStream());
                     } catch (IOException ex) {
                              // in case of the inputstream is not available we simply forward
                              // the
                              // errorstream of the connection (which should be the case for
                              // 400 requests)
                              // => error stream could also be null (e.g. for ABAP systems in
                              // case of 401)
                              pipe(conn.getErrorStream(), response.getOutputStream());
                     } finally {
                              // disconnect
                              conn.disconnect();
                     }

                     // log
                     this.log.info(infoLog.toString());

            } else {

                     // bad request: invalid URL
                     response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

            }

    } // method: dispatchRequest

    /**
    * pipes a given <code>InputStream</code> into the given
    * <code>OutputStream</code>
    * 
     * @param in
    *            <code>InputStream</code>
    * @param out
    *            <code>OutputStream</code>
    * @throws IOException
    */
    private static void pipe(InputStream in, OutputStream out)
                     throws IOException {
            try {
                     if (in != null && out != null) {
                              byte[] b = new byte[IO_BUFFER_SIZE];
                              int read;
                              while ((read = in.read(b)) != -1) {
                                       out.write(b, 0, read);
                              }
                     }
            } finally {
                     if (in != null) {
                              in.close();
                     }
                     if (out != null) {
                              out.flush();
                              out.close();
                     }
            }
    } // method: pipe


}
