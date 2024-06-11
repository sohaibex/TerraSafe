FROM docker.elastic.co/kibana/kibana:8.7.1
ENV ELASTICSEARCH_HOSTS=http://elasticsearch:8080
EXPOSE 8080
CMD ["sh", "-c", "bin/kibana --port 8080"]