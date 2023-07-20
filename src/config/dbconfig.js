module.exports = {
    user: process.env.NODE_ORACLEDB_USER || "hr",

    // Get the password from the environment variable
    // NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
    // string (not recommended), or it could be prompted for.
    // Alternatively use External Authentication so that no password is
    // needed.
    password: process.env.NODE_ORACLEDB_PASSWORD || "hr",

    // For information on connection strings see:
    // https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#connectionstrings
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "192.168.0.232:49161/xe",

    // Setting externalAuth is optional.  It defaults to false.  See:
    // https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#extauth
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false,
};
