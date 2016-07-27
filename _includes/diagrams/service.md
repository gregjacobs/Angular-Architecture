                                       2. HTTP Request to Server
                                                            |
                                                            |      +------------+
                                     +-----------------+    v      |            |
                                     |                 |           |            |
                                     |    (Service)    +----------->            |
                                     |                 |           |   Server   |
                                     |  Heroes Service <- - - - - -+            |
                                     |                 |           |            |
                                     +----^-----+------+     ^     |            |
                                          |     |            |     +------------+
                                          |                  |
                                          |     |    3. HTTP Response Received
                                          |
        1. Data Requested from Service -> |     |  <- 4. Data Models Returned
                                          |
                                          |     |
                                   +------+-----v-------+
                                   |                    |
                                   |       (Page)       |
                                   |                    |
                                   |  Heroes Dashboard  |
                                   |                    |
                                   |                    |
                                   |                    |
                                   +--------------------+
