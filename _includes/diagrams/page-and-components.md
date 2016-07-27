                                         1. Data Requested from Service
                                             |
                 +--------------------+      v
                 |                    |               +-----------------+
                 |       (Page)       +--------------->                 |
                 |                    |               |    (Service)    |
                 |  Heroes Dashboard  |               |                 |
                 |                    <- - - - - - - -+  Heroes Service |
                 |                    |               |                 |
                 |                    |          ^    +-----------------+
                 +----------+---------+          |
                            |                 2. Data Returned
                            |
                  +---------+--------+
                  |                  |   <- 3. Data Fed to Components
                  |                  |
        +---------v------+     +-----v---------+
        |                |     |               |
        |  (Component)   |     |  (Component)  |
        |                |     |               |
        |   Navigation   |     |  Heroes List  |
        |      Tabs      |     |               |
        |                |     |               |
        +----------------+     +---------------+
