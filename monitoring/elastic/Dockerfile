FROM docker.elastic.co/elasticsearch/elasticsearch:8.7.1
ENV discovery.type=single-node
ENV bootstrap.memory_lock=true
ENV ES_JAVA_OPTS="-Xms1024m -Xmx1024m"
ENV xpack.security.enabled=false
ENV xpack.security.enrollment.enabled=false
ENV xpack.security.http.ssl.enabled=false
ENV xpack.security.transport.ssl.enabled=false
EXPOSE 8080
CMD ["sh", "-c", "bin/elasticsearch -E http.port=8080 -E xpack.security.enabled=false -E xpack.security.enrollment.enabled=false -E xpack.security.http.ssl.enabled=false -E xpack.security.transport.ssl.enabled=false"]
