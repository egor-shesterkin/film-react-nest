FROM nginx:1.27-alpine

# Serve frontend static files from this mounted volume.
VOLUME ["/usr/share/nginx/html"]

COPY nginx.conf /etc/nginx/conf.d/default.conf
