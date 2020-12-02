const oracledb = require('oracledb')
    , fdk = require('@fnproject/fdk')
;

oracledb.outFormat = oracledb.OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

let pool;

fdk.handle(async function(input){
  let result = {};

  if (input.uuid === undefined || input.orderid === undefined || input.rate === undefined) {
    result.code = -2;
    return result;
  }

  if (!pool) {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.CONNECT_STRING_MICROSERVICE,
    });
  }

  const connection = await pool.getConnection();
  let sql, bindings;

  if (input.comments !== undefined) {
    sql = `update payments set servicesurvey=:rate,servicescomments=:comments where orderid=:orderid`;
    bindings = [input.rate,input.comments,input.orderid];
  } else {
    sql = `update payments set servicesurvey=:rate where orderid=:orderid`;
    bindings = [input.rate,input.orderid];
  }

  const record = await connection.execute(sql, bindings, { autoCommit: true });

  result.code = (record.rowsAffected == 1) ? 0 : -1;

  if (result.code == 0) {
    // Payment updated successfully, let's mark the UUID as used
    sql = `update polluuid set used='Y' where uuid=:uuid`;
    bindings = [input.uuid];
    connection.execute(sql, bindings, { autoCommit: true });
  }
  return result;
})

/**

process.env.DB_USER = "microservice";
process.env.DB_PASSWORD = "AAZZ__welcomedevops123";
process.env.CONNECT_STRING_MICROSERVICE = "158.101.175.134:1521/dodbhp_pdb1.sub03010825490.devopsvcn.oraclevcn.com";

async function x(input) {

  let result = {};

  if (input.orderid === undefined || input.rate === undefined) {
    result.code = -1;
    return result;
  }

  if (!pool) {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.CONNECT_STRING_MICROSERVICE,
    });
  }

  const connection = await pool.getConnection();
  let sql, bindings;

  if (input.comments !== undefined) {
    sql = `update payments set servicesurvey=:rate,servicescomments=:comments where orderid=:orderid`;
    bindings = [input.rate,input.comments,input.orderid];
  } else {
    sql = `update payments set servicesurvey=:rate where orderid=:orderid`;
    bindings = [input.rate,input.orderid];
  }

  const record = await connection.execute(sql, bindings, { autoCommit: true });

  console.log(record);

  result.code = (record.rowsAffected == 1) ? 0 : -1;
  return result;

}

x({orderid: "20190722132614", rate: 0});

**/
