FROM docker.elastic.co/elasticsearch/elasticsearch:7.17.7

# Disable security features
RUN echo "xpack.security.enabled: false" >> /usr/share/elasticsearch/config/elasticsearch.yml

# Ensure the necessary permissions
RUN chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/config/elasticsearch.yml

# Set the environment variable for discovery type and network host
ENV discovery.type=single-node
ENV network.host=0.0.0.0

# Expose the required ports
EXPOSE 9200 9300

# Start Elasticsearch
CMD ["elasticsearch"]
