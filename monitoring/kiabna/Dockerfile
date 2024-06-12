FROM docker.elastic.co/kibana/kibana:7.17.7

# Disable security by setting xpack.security.enabled to false
RUN echo -e "xpack.security.enabled: false\nserver.host: 0.0.0.0\nelasticsearch.hosts: ${ELASTICSEARCH_HOSTS}" > /usr/share/kibana/config/kibana.yml

# Ensure necessary permissions
RUN chown -R kibana:kibana /usr/share/kibana/config/kibana.yml

# Expose the required port
EXPOSE 5601

# Start Kibana
CMD ["kibana"]
