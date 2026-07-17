FROM postgres:16-alpine
COPY backup-postgres.sh /usr/local/bin/backup-postgres.sh
COPY run-loop.sh /usr/local/bin/run-loop.sh
RUN chmod +x /usr/local/bin/backup-postgres.sh /usr/local/bin/run-loop.sh
CMD ["/usr/local/bin/run-loop.sh"]
