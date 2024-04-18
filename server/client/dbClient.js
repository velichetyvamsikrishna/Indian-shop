const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
const config = require("../config");
const { warn } = require("console");
const bcrypt = require("bcrypt");
var moment = require('moment-timezone');

const caFilePath = path.join(__dirname, "..", "global-bundle.pem");

var docDbInstance;
const dbName = config.getMongoDbName();

/**
 * Create AWS Document DB connection
 */
async function createDocDBConnection() {
  if (docDbInstance) return docDbInstance;

  var client = MongoClient.connect(config.getMongoDbUrl(), {
    tlsCAFile: [caFilePath],
  });

  docDbInstance = client;
  return client;
}

/**
 *
 * @returns Load all payment role plan
 */
async function loadPaymentRolePlans() {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);

    const col = db.collection("paymentRolePlan");

    const roles = await col.find({}).toArray();
    return roles;
  } catch (err) {
    console.error("Error fetching user roles:", err);
    throw err;
  }
}

/**
 *
 * @returns Load all the devices
 */
async function loadDevices() {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("device");

    const devices = await col.find({}).toArray();
    return devices;
  } catch (err) {
    console.error("Error fetching device: ", err);
    throw err;
  }
}

/**
 *
 * @returns Load all the devices
 */
async function registerDevices(deviceDetails) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("userDevices");

    const existingUserDevices = await col.findOne({
      userId: deviceDetails.userId,
    });

    if (existingUserDevices) {
      console.log("User device already exists:", existingUserDevices);
      existingUserDevices.device.push(deviceDetails.device);
      console.log("updated user device:", existingUserDevices);

      const result = await col.updateOne(
        { userId: existingUserDevices.userId },
        {
          $set: {
            device: existingUserDevices.device,
          },
        }
      );

      if (result.modifiedCount === 1) {
        msg = {
          status: "success",
          message: "register & updated device successfully",
        };
        console.log(msg);
      } else {
        msg = {
          status: "warn",
          message: "unable to register the device",
        };
        console.log("Device registration failed");
      }
      return existingUserDevices;
    } else {
      const body = {
        userId: deviceDetails.userId,
        device: [
          {
            name: deviceDetails.device.name,
            deviceMake: deviceDetails.device.deviceMake,
            active: true,
            tivraUserId: deviceDetails.device.tivraUserId,
            terraDeviceUserId: deviceDetails.device.terraDeviceUserId,
          },
        ],
      };
      const result = await col.insertOne(body);

      console.log("Device registered successfully:", result);

      return result;
    }
  } catch (err) {
    console.error("Error registering the device: ", err);
    throw err;
  }
}

/**
 *
 * @returns Load user specific devices
 */
async function loadUserSpecificDevices(userId) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("userDevices");

    const devices = await col.findOne({ userId: userId });
    console.log("devices response: ", devices);
    return devices;
  } catch (err) {
    console.error("Error fetching device: ", err);
    throw err;
  }
}

/**
 *
 * @param {Save user details} userDetails
 * @returns
 */
async function saveUser(userDetails) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("user");

    const existingUser = await col.findOne({ email: userDetails.email });

    if (existingUser) {
      existingUser.isNewUser = false;
      console.log("User already exists:", existingUser);

      return existingUser;
    } else {
      // if (userDetails.password) {
      //   const hashedPassword = await bcrypt.hash(userDetails.password, 10);
      //   userDetails.password = hashedPassword;
      // }
      const result = await col.insertOne(userDetails);
      result.isNewUser = result.acknowledged;

      console.log("User inserted successfully:", result);

      return result;
    }
  } catch (err) {
    console.error("Error saving user:", err);
    throw err;
  }
}

/**
 * Function to validate hashed password
 * @param {*} plainTextPassword
 * @param {*} hashedPassword
 * @returns
 */
async function validateHashedPassword(plainTextPassword, hashedPassword) {
  try {
    // Use bcrypt.compare to validate the hashed password
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);

    if (isMatch) {
      console.log("Passwords match!");
      return true;
    } else {
      console.log("Passwords do not match.");
      return false;
    }
  } catch (error) {
    console.error("Error validating hashed values:", error);
    return false;
  }
}

/**
 *
 * @param {Validate the login users} loginDetails
 * @returns
 */
async function loginUser(loginDetails) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("user");

    // const user = await col.findOne({ email: loginDetails.username });
    const user = await col.findOne({
      $or: [
        { email: loginDetails.username },
        { email: loginDetails.username.toLowerCase() }
      ]
    });


    if (!user) {
      return { message: "User not found" };
    }
    // const hash = await bcrypt.hash(loginDetails.password, 10);
    const result = await bcrypt.compare(loginDetails.password, user.password);
    console.log("login user user : ", user.password);
    console.log("login user loginDetails : ", loginDetails.password);
    console.log("login user result : ", result);
    if (loginDetails.password !== user.password && !result) {
      return { message: "Invalid password" };
    }

    console.log("login user: ", user);
    if (loginDetails.timeZone) {
      const col1 = db.collection("userTimeZones");
      const existingUser = await col1.findOne({
        userId: user._id.toString()
      });

      if (existingUser) {
        const result = await col1.updateOne(
          { userId: user._id.toString() },
          {
            $set: {
              timeZone: loginDetails.timeZone,
            },
          }
        );
        // return result;
      } else {
        const body = {
          userId: user._id.toString(), timeZone: loginDetails.timeZone
        };
        const result = await col1.insertOne(body);

        // console.log("Device registered successfully:", result);

        // return result;
      }
    }
    return { message: "Login successful", userId: user._id.toString() };
  } catch (err) {
    console.error("Error during login:", err);
    throw err;
  }
}

/**
 *
 * @param {Validate the login users} loginDetails
 * @returns
 */
async function fetchUser(userId) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("user");

    console.log("Fetching for user: ", userId);

    const objectId = new ObjectId(userId);
    console.log("Fetching for user Object ID: ", objectId);

    const pipelineQuery = [
      {
        $match: {
          _id: objectId,
        },
      },
      {
        $lookup: {
          from: "paymentRolePlan",
          localField: "paymentPlanRole.roleId",
          foreignField: "id",
          as: "planDetails",
        },
      },
      {
        $unwind: "$planDetails",
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          middleName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          password: 1,
          registrationId: 1,
          paymentPlanRole: 1,
          demographic: 1,
          socialProfile: 1,
          healthFitness: 1,
          corporateAssociation: 1,
          roleName: "$planDetails.roleName",
          userRoleId: "$planDetails.userRoleId",
          profileImage: 1,
        },
      },
    ];

    const user = await col.aggregate(pipelineQuery).toArray();

    if (user.length == 0) {
      return { message: "User not found" };
    }

    user[0]["userId"] = user[0]._id.toString();

    console.log("login user: ", user[0]);

    return user[0];
  } catch (err) {
    console.error("Error during login:", err);
    throw err;
  }
}

/**
 *
 * @param {Validate the login users} loginDetails
 * @returns
 */
async function fetchUserByEmail(userEmail) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("user");

    console.log("Fetching for user: ", userEmail);

    const user = await col.find({ email: userEmail }).toArray();

    if (user.length == 0) {
      return { status: "none", message: "User not found" };
    }

    user[0]["userId"] = user[0]._id.toString();
    console.log("login user: ", user[0]);

    return user[0];
  } catch (err) {
    console.error("Error during login:", err);
    throw err;
  }
}

/**
 *
 * @param {Save webhookData Details} webhookDataDetails
 * @returns
 */
async function saveWebhookData(webhookDataDetails) {
  const client = await createDocDBConnection();

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Specify the database to be used
    const db = client.db(dbName);
    if (webhookDataDetails.type == "healthcheck") {
      const col = db.collection("terraHealthCheckData");

      const result = await col.insertOne(webhookDataDetails);
    }
    else if (webhookDataDetails.type == "auth" || webhookDataDetails.type == "deauth") {
      const col = db.collection("loginUserDeviceData");
      var allDevices = await loadDevices()

      if (webhookDataDetails.user && webhookDataDetails.user.user_id != null && webhookDataDetails.user.reference_id != null) {
        var userid = webhookDataDetails.user.reference_id;
        var deviceId = webhookDataDetails.user.user_id
        var devices = await loadUserSpecificDevices(userid);
        console.log("devices Auth " + JSON.stringify(devices))
        // if (devices != null) {
        //   devices = devices.device;
        //   devices = devices.filter((x) => x.deviceMake.toUpperCase() === webhookDataDetails.user.provider.toUpperCase());
        //   console.log("devices 1 " + JSON.stringify(devices))
        // if (devices && devices.length > 0) {
        if (webhookDataDetails.type == "auth") {
          // devices[0].active = true
          var device = allDevices.filter((x) => x.deviceMake.toUpperCase() === webhookDataDetails.user.provider.toUpperCase());
          let formData = {
            name: device[0].name,
            deviceMake: webhookDataDetails.user.provider.toLowerCase(),
            active: true,
            tivraUserId: webhookDataDetails.user.reference_id,
            terraDeviceUserId: webhookDataDetails.user.user_id,
          };
          var deviceData = {
            userId: formData.tivraUserId,
            device: formData,
          }
          console.log("devices Auth register " + JSON.stringify(deviceData))

          var status = await registerDevices(deviceData);
        }
        if (webhookDataDetails.type == "deauth") {
          // devices[0].active = false
          // var device = allDevices.filter((x) => x.deviceMake.toUpperCase() === webhookDataDetails.user.provider.toUpperCase());
          // let formData = {
          //   name: device[0].name,
          //   deviceMake: webhookDataDetails.user.provider.toLowerCase(),
          //   active: true,
          //   tivraUserId: webhookDataDetails.user.reference_id,
          //   terraDeviceUserId: webhookDataDetails.user.user_id ,
          // };
          // var deviceData ={
          //   userId: formData.tivraUserId,
          //   device: formData,
          // }
          const resp = await removeDevice(webhookDataDetails.user.user_id, webhookDataDetails.user.reference_id);

          // var status = await registerDevices(deviceData);
        }


        // console.log("devices data " + JSON.stringify(formData))
        // console.log("devices 2 " + JSON.stringify(devices[0]))
        // var status = await updateDeviceStatus(devices[0]);
        //  }
        // }
      }

      const result = await col.insertOne(webhookDataDetails);
    }
    else if (webhookDataDetails.type == "user_reauth") {
      const col = db.collection("loginUserDeviceData");
      var allDevices = await loadDevices()

      if (webhookDataDetails.old_user && webhookDataDetails.old_user.user_id != null && webhookDataDetails.old_user.reference_id != null) {
        var userid = webhookDataDetails.old_user.reference_id;
        var deviceId = webhookDataDetails.old_user.user_id
        var devices = await loadUserSpecificDevices(userid);
        console.log("Old User Device Details " + JSON.stringify(devices))
        if (devices != null) {
          devices = devices.device;
          devices.filter((x) => x.deviceMake.toUpperCase() === webhookDataDetails.old_user.provider.toUpperCase());

          if (devices.length > 0) {
            // devices[0].active = false
            // var status = await updateDeviceStatus(devices[0]);
            const resp = await removeDevice(webhookDataDetails.old_user.user_id, webhookDataDetails.old_user.reference_id);
          }
        }
      }
      if (webhookDataDetails.new_user && webhookDataDetails.new_user.user_id != null && webhookDataDetails.new_user.reference_id != null) {
        var userid = webhookDataDetails.new_user.reference_id;
        var deviceId = webhookDataDetails.new_user.user_id
        var devices = await loadUserSpecificDevices(userid);
        console.log("New User Device Details " + JSON.stringify(devices))

        // if (devices != null) {
        //   devices = devices.device;
        //   devices.filter((x) => x.deviceMake.toUpperCase() === webhookDataDetails.new_user.provider.toUpperCase());

        //   if (devices.length > 0) {
        var device = allDevices.filter((x) => x.deviceMake.toUpperCase() === webhookDataDetails.new_user.provider.toUpperCase());

        let formData = {
          name: device[0].name,
          deviceMake: webhookDataDetails.new_user.provider.toLowerCase(),
          active: true,
          tivraUserId: webhookDataDetails.new_user.reference_id,
          terraDeviceUserId: webhookDataDetails.new_user.user_id,
        };
        var deviceData = {
          userId: formData.tivraUserId,
          device: formData,
        }
        console.log("New User Device Data " + JSON.stringify(deviceData))

        //var status = await registerDevices(deviceData);
        // devices[0].active = false
        // var status = await updateDeviceStatus(devices[0]);
        //}
        // }
      }
      const result = await col.insertOne(webhookDataDetails);


    }
    else {
      // Specify the collection to be used
      const col = db.collection("terraData");

      const result = await col.insertOne(webhookDataDetails);
    }
  } catch (err) {
    console.error("Error saving webhookDataDetails:", err);
    throw err;
  }
}

/**
 *
 * @param {Save webhookData Details,dataconfigsamples} webhookDataDetails
 * @returns
 */
async function saveTerraData(webhookDataDetails, dataconfigsamples) {
  const client = await createDocDBConnection();

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Specify the database to be used
    const db = client.db(dbName);
    var arr = [];
    console.log("TestSamples1 " + webhookDataDetails.type)
    var UserTimeZone = await getUserTimeZone(webhookDataDetails['user']['reference_id']);
    // console.log("TestSamples11 "+JSON.stringify(dataconfigsamples))
    dataconfigsamples = await fetchDashboardMetricsDevicesConfig("");

    if (webhookDataDetails.type != "healthcheck" && webhookDataDetails.type != "auth" && webhookDataDetails.type != "deauth" && webhookDataDetails.type != "user_reauth" && webhookDataDetails["user"]["reference_id"] != null) {

      var filterdDataConfigSamples = dataconfigsamples.filter(function (el) {
        return el.provider.toUpperCase() == webhookDataDetails['user']['provider'].toUpperCase();
      });
      // console.log("test length " + filterdDataConfigSamples.length)
      filterdDataConfigSamples.forEach(async function (sample) {
        // if (sample.dataType == webhookDataDetails.type) {
        // console.log("test data length " + webhookDataDetails.data.length)
        webhookDataDetails.data.forEach(async function (itemData) {
          /*  console.log("test "+sample.dataSource)
            console.log("test "+webhookDataDetails["user"]["provider"].toUpperCase())
              console.log("test "+sample.provider.toUpperCase()) */
          var value;

          if (
            sample.dataSource != '' && itemData[sample.dataSource]) { //sample.provider.toUpperCase() ==webhookDataDetails['user']['provider'].toUpperCase() &&
            // console.log('test key ' + sample.key);
            // console.log('test key ' + sample.provider);
            //   console.log("test dataSource " + sample.dataSource)
            var data = itemData[sample.dataSource];
            // console.log("TestSamples21 " + JSON.stringify(sample.datasamples))
            //  console.log("TestSamples22 " + JSON.stringify(data))

            sample.datasamples.forEach(function (keyitem, index) {
              // console.log("TestSamples31 " + keyitem.key)
              // console.log("TestSamples32 " + JSON.stringify(value))
              if (value == undefined) {
                // if (keyitem.type == "arr") {
                //   if (data[keyitem.key]) { //&& data[keyitem.key].length > 0
                //     value = data[keyitem.key];
                //   }
                // } else {
                //   if (data[keyitem.key]) {
                //     value = data[keyitem.key];
                //   }
                // }
                value = data[keyitem.key];
              } else {
                // if (keyitem.type == "arr") {
                //   if (value[keyitem.key] ) {//&& value[keyitem.key].length > 0
                //     value = value[keyitem.key];
                //   }
                // } else {
                //   if (value[keyitem.key]) {
                //     value = value[keyitem.key];
                //   }
                // }
                value = value[keyitem.key];
              }
              // console.log("TestSamples3 " + index)
              if (index == sample.datasamples.length - 1) {
                //   console.log("TestSamples31 " + JSON.stringify(value))
                if (value != null && !Array.isArray(value)) {
                  var obj = {};
                  obj[keyitem.key] = value;
                  value = [obj];
                }
              }
            });
            // console.log("TestSample51 " + JSON.stringify(value))
            if (value == null || value == undefined || value.length == 0) {
              sample.datakey.forEach(function (keyitem, index) {
                // console.log("TestSamples41 " + keyitem.key)
                // console.log("TestSamples42 " + JSON.stringify(value))
                if (value == null || value == undefined || value.length == 0) {
                  // if (keyitem.type == "arr") {
                  //   if (data[keyitem.key] && data[keyitem.key].length > 0) {
                  //     value = data[keyitem.key];
                  //   }
                  // } else {
                  //   if (data[keyitem.key]) {
                  //     value = data[keyitem.key];
                  //   }
                  // }
                  value = data[keyitem.key];
                } else {
                  // if (keyitem.type == "arr") {
                  //   if (value[keyitem.key] && value[keyitem.key].length > 0) {
                  //     value = value[keyitem.key];
                  //   }
                  // } else {
                  //   if (value[keyitem.key]) {
                  //     value = value[keyitem.key];
                  //   }
                  // }
                  value = value[keyitem.key];
                }
              });
              if (value != null && value != undefined && sample.valuekey[0]) {
                var obj = {};
                obj[sample.valuekey[0]] = value;
                value = [obj];
              }
            }
          }

          // console.log('TestSamples4 ' + JSON.stringify(value));

          if (value && (value != null || value != undefined || value.length > 0)) {
            var values = [];
            console.log('test key ' + sample.key);
            console.log('TestSamples111 ' + JSON.stringify(value));
            value.forEach(async function (valueItem) {
              //console.log('TestSamples112 ' + sample.valuekey.length);
              if (sample.valuekey.length > 0) {
                var obj = {
                  userId: webhookDataDetails['user']['reference_id'],
                  terraUserId: webhookDataDetails['user']['user_id'],
                  provider: webhookDataDetails['user']['provider'],
                };
                console.log("UserTimeZone " + JSON.stringify(UserTimeZone));
                var timezone
                if (UserTimeZone) {
                  timezone = UserTimeZone.timeZone;
                }
                var date
                if (timezone) {
                  date = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }))
                }
                else {
                  var date = new Date()
                }
                if (sample.valuekey.length == 2) {
                  obj['value'] = valueItem[sample.valuekey[0]];
                  if (valueItem[sample.valuekey[1]]) {
                    obj['timestamp'] = new Date(valueItem[sample.valuekey[1]]);
                  }
                  else {
                    obj['timestamp'] = date;
                  }
                }
                else if (sample.valuekey.length == 3) {

                  obj['value'] = parseFloat(valueItem[sample.valuekey[0]]).toFixed(1) + "/" + parseFloat(valueItem[sample.valuekey[1]]).toFixed(1);
                  if (valueItem[sample.valuekey[2]]) {
                    obj['timestamp'] = new Date(valueItem[sample.valuekey[2]]);
                  }
                  else {
                    obj['timestamp'] = date;
                  }
                }
                else {
                  var val = valueItem[sample.valuekey[0]];
                  if (Array.isArray(val)) {
                    // if (val.length == 0) {
                    //   val == null;
                    // }
                    val = null;
                  }
                  obj['value'] = val;
                  obj['timestamp'] = date;
                  // obj['timestamp'] = new Date().toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short" })
                }
                if (obj['value'] != null) {
                  values.push(obj);
                }
              }
            });
            console.log('TestSamples113 ' + values.length);
            if (values.length > 0) {
              console.log('TestSamples114 ' + sample.key);
              console.log('TestSamples114 values ' + JSON.stringify(values));
              const col = db.collection('tivra' + sample.key + 'Samples');
              const result = await col.insertMany(values);
            }
            var obj = {
              userId: webhookDataDetails['user']['reference_id'],
              terraUserId: webhookDataDetails['user']['user_id'],
              provider: webhookDataDetails['user']['provider'],
              // creationDate: new Date(),
            };
            var key = sample.key + 'Data';
            // var keyTable = sample.key.toLowerCase() + "SamplesData";
            obj[key] = value;
            obj['creationDate'] = new Date();
            arr.push(obj);
            const col = db.collection('TestSamplesData');
            console.log('TestSamples5 ' + obj);
            const result = await col.insertOne(obj);
            console.log('webhookDataDetails inserted successfully:', result);
          }
        });

        // }

        // }
      });


      // dataconfigsamples.forEach(async function (sample) {
      //   console.log("TestSamples2 " + webhookDataDetails["data"].length)
      //   // if (sample.dataType == webhookDataDetails.type) {
      //   var value;
      //   webhookDataDetails.data.forEach(function (itemData) {
      //     if (sample.dataSource != "" && sample.provider.toUpperCase() == itemData["user"]["provider"].toUpperCase()) {
      //       var data = itemData[sample.dataSource];
      //       console.log("TestSamples21 " + JSON.stringify(sample.datasamples))
      //       console.log("TestSamples22 " + JSON.stringify(data))

      //       sample.datasamples.forEach(function (keyitem, index) {
      //         console.log("TestSamples31 " + keyitem.key)
      //         if (value == undefined) {
      //           if (keyitem.type == "arr") {
      //             if (data[keyitem.key] && data[keyitem.key].length > 0) {
      //               value = data[keyitem.key];
      //             }
      //           } else {
      //             if (data[keyitem.key]) {
      //               value = data[keyitem.key];
      //             }
      //           }
      //         } else {
      //           if (keyitem.type == "arr") {
      //             if (value[keyitem.key] && value[keyitem.key].length > 0) {
      //               value = value[keyitem.key];
      //             }
      //           } else {
      //             if (value[keyitem.key]) {
      //               value = value[keyitem.key];
      //             }
      //           }
      //         }
      //         console.log("TestSamples3 " + index)
      //         if (index == sample.datasamples.length - 1) {
      //           console.log("TestSamples31 " + index)
      //           if (value != null && !Array.isArray(value)) {
      //             var obj = {}
      //             obj[keyitem.key] = value;
      //             value = [obj];
      //           }
      //         }
      //       });

      //       if (value == null || value == undefined || value.length == 0) {
      //         sample.datakey.forEach(function (keyitem, index) {
      //           console.log("TestSamples41 " + keyitem.key)
      //           if (value == undefined) {
      //             if (keyitem.type == "arr") {
      //               if (data[keyitem.key] && data[keyitem.key].length > 0) {
      //                 value = data[keyitem.key];
      //               }
      //             } else {
      //               if (data[keyitem.key]) {
      //                 value = data[keyitem.key];
      //               }
      //             }
      //           } else {
      //             if (keyitem.type == "arr") {
      //               if (value[keyitem.key] && value[keyitem.key].length > 0) {
      //                 value = value[keyitem.key];
      //               }
      //             } else {
      //               if (value[keyitem.key]) {
      //                 value = value[keyitem.key];
      //               }
      //             }
      //           }
      //         });
      //       }
      //     }
      //   })
      //   console.log("TestSamples4 " + value)

      //   if (value != null || value != undefined) {
      //     var values = [];
      //     console.log("TestSamples111 " + JSON.stringify(value));
      //     value.forEach(async function (valueItem) {
      //       console.log("TestSamples112 " + sample.valuekey.length);
      //       if (sample.valuekey.length > 0) {
      //         var obj = {
      //           userId: webhookDataDetails["user"]["reference_id"],
      //           terraUserId: webhookDataDetails["user"]["user_id"],
      //           provider: webhookDataDetails["user"]["provider"],
      //         };
      //         if (sample.valuekey.length == 2) {
      //           obj["value"] = valueItem[sample.valuekey[0]];
      //           obj["timestamp"] = valueItem[sample.valuekey[1]];
      //         }
      //         else {
      //           obj["value"] = valueItem[sample.valuekey[0]];
      //           obj["timestamp"] = new Date();
      //         }
      //         if (obj["value"] != null) {
      //           values.push(obj);
      //         }
      //       }
      //     });
      //     console.log("TestSamples113 " + values.length);
      //     if (values.length > 0) {
      //       console.log("TestSamples114 " + sample.key);
      //       const col = db.collection("tivra" + sample.key + "Samples");
      //       const result = await col.insertMany(values);
      //       console.log("TestSamples115 ");
      //     }
      //     var obj = {
      //       userId: webhookDataDetails["user"]["reference_id"],
      //       terraUserId: webhookDataDetails["user"]["user_id"],
      //       provider: webhookDataDetails["user"]["provider"],
      //       // creationDate: new Date(),
      //     };
      //     var key = sample.key + "Data";
      //     // var keyTable = sample.key.toLowerCase() + "SamplesData";
      //     obj[key] = value;
      //     obj["creationDate"] = new Date();
      //     arr.push(obj);
      //     const col = db.collection("TestSamplesData");
      //     console.log("TestSamples5 " + obj)
      //     const result = await col.insertOne(obj);
      //     console.log("webhookDataDetails inserted successfully:", result);
      //   }
      //   // }

      //   // }
      // });
    }
  } catch (err) {
    console.error("Error saving webhookDataDetails:", err);
    throw err;
  }
}

/**
 *
 * @param {Update user account details} userDetails
 * @returns
 */
async function updateUserAccount(userDetails, operation) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("user");

    if (operation === "reset-password") {
      const user = await col.findOne({ email: userDetails.email });

      let msg = { status: "warn", message: "User not found" };
      if (!user) {
        console.log(msg);
        return msg;
      }
      const hashedPassword = await bcrypt.hash(userDetails.password, 10);
      userDetails.password = hashedPassword;
      const result = await col.updateOne(
        { email: userDetails.email },
        {
          $set: {
            password: userDetails.password,
          },
        }
      );
      if (result.modifiedCount === 1) {
        msg = { status: "success", message: "Password updated successfully" };
        console.log(msg);
      } else {
        msg = {
          status: "warn",
          message: "Kindly enter the new password. Do not use old password.",
        };
        console.log("Password update failed");
      }
      return msg;
    } else {
      if (operation === "register-account") {
        const hashedPassword = await bcrypt.hash(userDetails.password, 10);
        userDetails.password = hashedPassword;
      }
      let updateOperation = {
        $set: {
          password: userDetails.password,
          registrationId: userDetails.registrationId,
          profileImage: userDetails.profileImage,
        },
      };
      if (operation === "edit-profile") {
        if (userDetails.type == "Athletic Coach" || userDetails.type == "Aviation Medical Examiner (AME)" || userDetails.type == "Healthcare Professional") {
          const organization = {
            organizationName: userDetails.organizationName,
            npi: userDetails.npi,
            yearsOfCoaching: userDetails.yearsOfCoaching,
            address1: userDetails.organizationaddress1,
            address2: userDetails.organizationaddress2,
            state: userDetails.organizationstate,
            city: userDetails.organizationcity,
            zipCode: userDetails.organizationzipCode,
            //  country: userDetails.country,
            //  trackHealth: userDetails?.trackHealth == "corporateProfile.trackHealth",
            //  typeOfEngagement: userDetails.typeOfEngagement,
          };
          updateOperation = {
            $set: {
              firstName: userDetails.firstName,
              middleName: userDetails.middleName,
              lastName: userDetails.lastName,
              phoneNumber: userDetails.phoneNumber,
              profileImage: userDetails.profileImage,
              demographic: {
                address1: userDetails.address1,
                address2: userDetails.address2,
                city: userDetails.city,
                state: userDetails.state,
                zip: userDetails.zipCode,
                country: userDetails.country,
                dob: userDetails.dateOfBirth,
                gender: userDetails.gender,
              },
              socialProfile: {
                educationLevel: userDetails.educationLevel,
                healthCare: userDetails.healthcare,
                hospitalAssociated: userDetails.hospitalAssociated,
                incomeRange: userDetails.incomeRange,
              },
              healthFitness: {
                chronicCondition: userDetails.chronicCondition,
                height: userDetails.height,
                smoker: userDetails.smoker,
                weight: userDetails.weight,
              },
              corporateAssociation: organization,
            },
          };

        }
        else {
          updateOperation = {
            $set: {
              firstName: userDetails.firstName,
              middleName: userDetails.middleName,
              lastName: userDetails.lastName,
              phoneNumber: userDetails.phoneNumber,
              profileImage: userDetails.profileImage,
              demographic: {
                address1: userDetails.address1,
                address2: userDetails.address2,
                city: userDetails.city,
                state: userDetails.state,
                zip: userDetails.zipCode,
                country: userDetails.country,
                dob: userDetails.dateOfBirth,
                gender: userDetails.gender,
              },
              socialProfile: {
                educationLevel: userDetails.educationLevel,
                healthCare: userDetails.healthcare,
                hospitalAssociated: userDetails.hospitalAssociated,
                incomeRange: userDetails.incomeRange,
              },
              healthFitness: {
                chronicCondition: userDetails.chronicCondition,
                height: userDetails.height,
                smoker: userDetails.smoker,
                weight: userDetails.weight,
              },
            },
          };
        }


      }

      console.log("Updated profile payload: ", updateOperation);

      const objectId = new ObjectId(userDetails.userId);
      const result = await col.updateOne({ _id: objectId }, updateOperation,
        { upsert: true });

      if (result.modifiedCount === 1) {
        return {
          valid: true,
          message: "User account updated successfully",
          result,
        };
      } else {
        return { valid: true, message: "no update in user account", result };
      }
    }
  } catch (err) {
    console.error("Error saving the edited user:", err);
    throw err;
  }
}

/**
 *
 * @param {Update user role details} userDetails
 * @returns
 */
async function updateUserRole(userDetails) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("user");

    const objectId = new ObjectId(userDetails.userId);
    const updateOperation = {
      $set: {
        paymentPlanRole: {
          roleId: userDetails.roleId,
          planId: userDetails.planId,
        },
        registrationId: userDetails.registrationId,
      },
    };
    const result = await col.updateOne({ _id: objectId }, updateOperation);
    if (result.modifiedCount === 1) {
      return { message: "User role updated successfully", result };
    } else {
      return { message: "No updates for the user role", result };
    }
  } catch (err) {
    console.error("Error while updating role user:", err);
    throw err;
  }
}

/**
 *
 * @param {Update user demographic details} userDetails
 * @returns
 */
async function updateUserDemographic(userDetails) {
  const client = await createDocDBConnection();
  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("user");

    const objectId = new ObjectId(userDetails.userId);
    const updateOperation = {
      $set: {
        demographic: {
          address1: userDetails.address1,
          address2: userDetails.address2,
          city: userDetails.city,
          country: userDetails.country,
          dob: userDetails.dob,
          gender: userDetails.gender,
          state: userDetails.state,
          zip: userDetails.zip,
        },
      },
    };

    const result = await col.updateOne({ _id: objectId }, updateOperation);
    if (result.modifiedCount === 1) {
      return { message: "User demographic updated successfully", result };
    } else {
      return { message: "no update in user demographic", result };
    }
  } catch (err) {
    console.error("Error while updating demographic user:", err);
    throw err;
  }
}

/**
 *
 * @param {Update user social profile details} userDetails
 * @returns
 */
async function updateUserSocialProfile(userDetails) {
  const client = await createDocDBConnection();

  console.log("Social detail: ", userDetails);

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("user");

    const objectId = new ObjectId(userDetails.formData.userId);
    const updateOperation = {
      $set: {
        socialProfile: {
          educationLevel: userDetails.formData.educationLevel,
          healthCare: userDetails.formData.healthCare,
          hospitalAssociated: userDetails.formData.hospitalAssociated,
          incomeRange: userDetails.formData.incomeRange,
        },
      },
    };
    console.log("Social operation: ", updateOperation);
    const result = await col.updateOne({ _id: objectId }, updateOperation);
    if (result.modifiedCount === 1) {
      return { message: "User social profile updated successfully", result };
    } else {
      return { message: "no update in user social profile", result };
    }
  } catch (err) {
    console.error("Error while updating social profile user:", err);
    throw err;
  }
}

/**
 *
 * @param {Update user health & fitness profile details} userDetails
 * @returns
 */
async function updateUserHealthFitnessProfile(userDetails) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("user");

    console.log("user details: ", userDetails);
    const objectId = new ObjectId(userDetails.formData.userId);
    const updateOperation = {
      $set: {
        healthFitness: {
          chronicCondition: userDetails.formData.chronicCondition,
          height: userDetails.formData.height,
          smoker: userDetails.formData.smoker,
          weight: userDetails.formData.weight,
        },
        registrationId: userDetails.formData.registrationId,
      },
    };
    console.log("health fitness updated operation: ", updateOperation);

    const result = await col.updateOne({ _id: objectId }, updateOperation);
    if (result.modifiedCount === 1) {
      return {
        message: "User health & fitness profile updated successfully",
        result,
      };
    } else {
      return { message: "no update in user health & fitness profile", result };
    }
    w;
  } catch (err) {
    console.error("Error while updating health & fitness profile user:", err);
    throw err;
  }
}

/**
 *
 * @param {Update user health & fitness profile details} userDetails
 * @returns
 */
async function updateUserCorporateAssociationProfile(userDetails) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("user");

    console.log("user details: ", userDetails);
    const objectId = new ObjectId(userDetails.formData.userId);

    const organization = {
      organizationName: userDetails.formData.organizationName,
      npi: userDetails.formData.npi,
      yearsOfCoaching: userDetails.formData.yearsOfCoaching,
      address1: userDetails.formData.address1,
      address2: userDetails.formData.address2,
      state: userDetails.formData.state,
      city: userDetails.formData.city,
      zipCode: userDetails.formData.zipCode,
      country: userDetails.formData.country,
      trackHealth: userDetails?.trackHealth == "corporateProfile.trackHealth",
      typeOfEngagement: userDetails.typeOfEngagement,
    };
    const updateOperation = {
      $set: {
        corporateAssociation: organization,
        registrationId: userDetails.registrationId,
      },
    };
    console.log("corporate association updated operation: ", updateOperation);

    const result = await col.updateOne({ _id: objectId }, updateOperation);

    //saving organization
    saveOrganization(organization);
    if (result.modifiedCount === 1) {
      return {
        message: "User corporation affiliation updated successfully",
        result,
      };
    } else {
      return { message: "no update in user corporation affiliation", result };
    }
  } catch (err) {
    console.error(
      "Error while updating corporation affiliation profile user:",
      err
    );
    throw err;
  }
}

/**
 *
 * @param {Load Nutrition log details of a user} userDetails
 * @returns
 */
async function loadNutritionLogBy(userId, date) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("nutritionLog");

    const query = { userId: userId, creationTs: date };
    console.log("Nutrition search query: ", query);

    const user = await col.find(query).toArray();
    console.log("Nutrition user data: ", user);

    return user;
  } catch (err) {
    console.error("Error while fetching Nutrition log:", err);
    throw err;
  }
}

/**
 *
 * @param {Update Nutrition log details of the user} userDetails
 * @returns
 */
async function saveNutritionLog(nutritionLogDetails) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("nutritionLog");

    const result = await col.insertOne(nutritionLogDetails);
    if (result.acknowledged) {
      var nutritionlogid = result.insertedId;

      var UserTimeZone = await getUserTimeZone(nutritionLogDetails.userId);
      console.log("UserTimeZone " + JSON.stringify(UserTimeZone));
      var timezone = UserTimeZone.timeZone;
      // console.log("UserTimeZone date 1 " + moment.tz(new Date(), timezone).format());
      // var date = moment(moment.tz(new Date(), timezone).format()).toDate()
      // var date = moment.tz(new Date(), timezone).format();
      var date = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }))
      console.log("UserTimeZone date " + date);



      if (nutritionLogDetails.calories != "") {
        var collection = db.collection("tivraCaloriesConsumedSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.calories,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);
      }
      if (nutritionLogDetails.cholesterol != "") {
        var collection = db.collection("tivraCholesterolSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.cholesterol,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);
      }
      if (nutritionLogDetails.fat != "") {
        var collection = db.collection("tivraFatSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.fat,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);
      }
      if (nutritionLogDetails.fiber != "") {
        var collection = db.collection("tivraFiberSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.fiber,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);
      }
      if (nutritionLogDetails.protein != "") {
        var collection = db.collection("tivraProtienSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.protein,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);
      }
      if (nutritionLogDetails.sugar != "") {
        var collection = db.collection("tivraSugarSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.sugar,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Sodium != "") {
        var collection = db.collection("tivraSodiumSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Sodium,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Potassium != "") {
        var collection = db.collection("tivraPotassiumSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Potassium,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Carbohydrates != "") {
        var collection = db.collection("tivraCarbohydratesSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Carbohydrates,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Saturatedfat != "") {
        var collection = db.collection("tivraSaturatedfatSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Saturatedfat,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Antioxidants != "") {
        var collection = db.collection("tivraAntioxidantsSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Antioxidants,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.BVitamins != "") {
        var collection = db.collection("tivraBVitaminsSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.BVitamins,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Calcium != "") {
        var collection = db.collection("tivraCalciumSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Calcium,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.FattyAcids != "") {
        var collection = db.collection("tivraFattyAcidsSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.FattyAcids,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Iron != "") {
        var collection = db.collection("tivraIronSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Iron,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Magnesium != "") {
        var collection = db.collection("tivraMagnesiumSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Magnesium,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.VitaminD != "") {
        var collection = db.collection("tivraVitaminDSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.VitaminD,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Water != "") {
        var collection = db.collection("tivraWaterSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Water,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Zinc != "") {
        var collection = db.collection("tivraZincSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Zinc,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.AddedSugars != "") {
        var collection = db.collection("tivraAddedSugarsSamples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.AddedSugars,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }
      if (nutritionLogDetails.Omega3 != "") {
        var collection = db.collection("tivraOmega3Samples");
        var obj = {
          "userId": nutritionLogDetails.userId,
          "terraUserId": "",
          "provider": "SYSTEM",
          "value": nutritionLogDetails.Omega3,
          "timestamp": date,
          "nutritionlogid": nutritionlogid
        }
        var output = await collection.insertOne(obj);

      }

    }
    console.log("Nutrition inserted successfully:", result);
    return result;
  } catch (err) {
    console.error("Error while updating Nutrition log for user:", err);
    throw err;
  }
}

/**
 *
 * @param {Update Nutrition log details of the user} userDetails
 * @returns
 */
async function deleteNutritionLog(nutritionLogId) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("nutritionLog");

    const objectId = new ObjectId(nutritionLogId);
    console.log("nutritionlogid :", nutritionLogId);
    console.log("nutritionlogid :", objectId);
    const result = await col.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      const msg = "Nutrition log deleted successfully.";
      console.log(msg);
      var collection = db.collection("tivraCaloriesConsumedSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraCholesterolSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraFatSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraFiberSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraProtienSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraSugarSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraSodiumSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraPotassiumSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraAntioxidantsSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraBVitaminsSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraCalciumSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraFattyAcidsSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraIronSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraMagnesiumSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraVitaminDSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraWaterSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraZincSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });

      var collection = db.collection("tivraAddedSugarsSamples");
      var output = await collection.deleteOne({ nutritionlogid: objectId });


      return { status: "success", msg: msg };
    } else {
      const msg = "Nutrition log not found.";
      console.log(msg);

      return { status: "warn", msg: msg };
    }
  } catch (err) {
    console.error("Error while deleting Nutrition log for user:", err);
    throw err;
  }
}

/**
 *
 * @param {Update user social profile details} userDetails
 * @returns
 */
async function updateNutritionLog(nutritionLogDetails) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("nutritionLog");

    const objectId = new ObjectId(nutritionLogDetails.formData.userId);
    const updateOperation = {
      $set: {
        socialProfile: {
          educationLevel: nutritionLogDetails.formData.educationLevel,
          healthCare: nutritionLogDetails.formData.healthCare,
          hospitalAssociated: nutritionLogDetails.formData.hospitalAssociated,
          incomeRange: nutritionLogDetails.formData.incomeRange,
        },
      },
    };
    console.log("Social operation: ", updateOperation);
    const result = await col.updateOne({ _id: objectId }, updateOperation);
    if (result.modifiedCount === 1) {
      return { message: "User social profile updated successfully", result };
    } else {
      return { message: "no update in user social profile", result };
    }
  } catch (err) {
    console.error("Error while updating social profile user:", err);
    throw err;
  }
}

/**
 *
 * @param {View sent/receive invitation of the user} userDetails
 * @returns
 */
async function getInvite(userId, isMyInvitation) {
  let user;
  try {
    user = await fetchUser(userId);
    console.log("Invited user: ", user);
  } catch (error) {
    return { message: "user doesn't exist" };
  }

  try {
    const client = await createDocDBConnection();
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("invitation");

    let query;
    if (!isMyInvitation) {
      query = { senderEmail: user.email };
    } else {
      query = { inviteEmail: user.email };
    }
    console.log("Invitation search query: ", query);

    const invitation = await col.find(query).toArray();
    console.log("Invitation retrieved successfully:", invitation);

    let invitationArr = [];

    if (invitation.length > 0) {
      invitation.forEach(function (invite) {
        invite.id = invite._id.toString();
        invitationArr.push(invite);
      });
    }
    console.log("Invitation retrieved:", invitationArr);

    return invitationArr;
  } catch (err) {
    console.error("Error while retrieving the invitation for user:", err);
    throw err;
  }
}

/**
 *
 * @param {View sent/receive invitation of the user} userDetails
 * @returns
 */
async function searchInviteOfRecipient(sendEmailId, recipientEmailId) {
  try {
    const client = await createDocDBConnection();
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("invitation");

    const query = { senderEmail: sendEmailId, inviteEmail: recipientEmailId };
    console.log("Invitation search query: ", query);

    const invitation = await col.find(query).toArray();
    console.log("Invitation retrieved successfully:", invitation);

    return invitation;
  } catch (err) {
    console.error("Error while retrieving the invitation for user:", err);
    throw err;
  }
}

/**
 *
 * @param {Save invite details} inviteDetails
 * @returns
 */
async function saveInvite(inviteDetails) {
  let invitation;
  try {
    invitation = await searchInviteOfRecipient(
      inviteDetails.senderEmail,
      inviteDetails.inviteEmail
    );
  } catch (err) {
    console.error("Error while retrieving the invitation:", err);
    throw err;
  }

  if (invitation !== undefined && invitation.length > 0) {
    return { message: "Invitation already exist" };
  }

  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);

    const pipelineQuery = [
      {
        $match: {
          email: inviteDetails.inviteEmail,
        },
      },
      {
        $lookup: {
          from: "paymentRolePlan",
          localField: "paymentPlanRole.roleId",
          foreignField: "id",
          as: "userWithRole",
        },
      },
      {
        $unwind: "$userWithRole",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          roleName: "$userWithRole.roleName",
        },
      },
    ];
    const senderpipelineQuery = [
      {
        $match: {
          email: inviteDetails.senderEmail,
        },
      },
      {
        $lookup: {
          from: "paymentRolePlan",
          localField: "paymentPlanRole.roleId",
          foreignField: "id",
          as: "userWithRole",
        },
      },
      {
        $unwind: "$userWithRole",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          roleName: "$userWithRole.roleName",
        },
      },
    ];

    const userCol = db.collection("user");



    const invitedUser = await userCol.aggregate(pipelineQuery).toArray();
    const sendUser = await userCol.aggregate(senderpipelineQuery).toArray();

    // const sendUser = await userCol.find({ email: inviteDetails.senderEmail }).toArray();

    console.log("Invited user: ", invitedUser);
    let isUserNewToTivra = false;
    if (invitedUser.length == 0) {
      const msg = "Invited user doesn't exist in TIVRA";
      console.log(msg);
      isUserNewToTivra = true;
    }

    const col = db.collection("invitation");

    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 7);

    const inviteObject = {
      userName:
        invitedUser.length !== 0
          ? invitedUser[0].firstName + " " + invitedUser[0].lastName
          : inviteDetails.inviteEmail,
      icon: invitedUser.length !== 0 ? invitedUser[0].profileImage : "",
      role: invitedUser.length !== 0 ? invitedUser[0].roleName : "",
      senderUserName: sendUser.length !== 0
        ? sendUser[0].firstName + " " + sendUser[0].lastName
        : inviteDetails.senderEmail,
      senderRole: sendUser.length !== 0 ? sendUser[0].roleName : "",
      status: "Pending",
      date: currentDate,
      endDate: endDate,
      isIncomingInvite: false,
      senderEmail: inviteDetails.senderEmail,
      senderUserId: inviteDetails.senderUserId,
      inviteEmail: inviteDetails.inviteEmail,
      subject: inviteDetails.subject,
      isApproved: false,
    };
    console.log("Invite object: ", inviteObject);

    const result = await col.insertOne(inviteObject);
    result.isUserNewToTivra = isUserNewToTivra;

    console.log("Invitation inserted successfully:", result);

    return result;
  } catch (err) {
    console.error("Error saving Invitation :", err);
    throw err;
  }
}

/**
 *
 * @param {Update invitation details} userDetails
 * @returns
 */
async function updateInvite(invitationUpdateReq) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("invitation");

    const objectId = new ObjectId(invitationUpdateReq.id);

    const invitationDetails = await col.findOne({ _id: objectId });
    console.log("invitationDetails: ", invitationDetails);

    let invitedUser;
    let updateOperation;

    if (invitationDetails.status == "Revoke") {
      updateOperation = {
        $set: {
          status: invitationDetails.status,
        },
      };
    }
    if (invitationDetails.status == "Resend") {
      updateOperation = {
        $set: {
          status: invitationDetails.status,
        },
      };
    } else if (invitationDetails) {
      invitedUser = await fetchUserByEmail(invitationDetails?.inviteEmail);
      console.log("inviteUser: ", invitedUser);

      if (invitedUser?.status == "none") {
        const msg = "Invited user doesn't exist in TIVRA.";
        console.log(msg);
        return { status: "warn", message: msg };
      }
    }

    if (invitationUpdateReq.isApproved !== undefined) {
      updateOperation = {
        $set: {
          isApproved: invitationUpdateReq.isApproved,
        },
      };
    } else {
      updateOperation = {
        $set: {
          status: invitationUpdateReq.status,
        },
      };
    }

    console.log("update request payload: ", updateOperation);
    const result = await col.updateOne({ _id: objectId }, updateOperation);

    if (result.modifiedCount === 1) {
      if (invitationUpdateReq.isApproved) {
        await addMateToTeam(invitationDetails, invitedUser);
      }

      return {
        valid: true,
        message: "Invitation updated successfully",
        result,
      };
    } else {
      return { valid: true, message: "no update in invite", result };
    }
  } catch (err) {
    console.error("Error updating invitation:", err);
    throw err;
  }
}

/**
 *
 * @param {Fetch team info config}
 * @returns
 */
async function addMateToTeam(invitationDetails, invitedUserDetail) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("team");

    const teamDetails = await col.findOne({
      userId: invitationDetails?.senderUserId,
    });
    console.log("teamDetails: ", teamDetails);

    const teamMate = {
      name:
        invitationDetails?.userName != null &&
          invitationDetails?.userName != undefined &&
          invitationDetails?.userName != ""
          ? invitationDetails?.userName
          : invitedUserDetail?.firstName + " " + invitedUserDetail?.lastName,
      userId: invitedUserDetail?.userId,
      active: "isEven",
    };
    console.log("teamMate: ", teamMate);

    if (!teamDetails) {
      const team = {
        userId: invitationDetails?.senderUserId,
        team: [teamMate],
      };
      const result = await col.insertOne(team);
      if (result.modifiedCount === 1) {
        console.log("New team created successfully");
      }
    } else {
      teamDetails?.team.push(teamMate);
      console.log("teamDetails: ", teamDetails);

      const result = await col.updateOne(
        { userId: teamDetails?.userId },
        { $set: teamDetails }
      );

      if (result.modifiedCount === 1) {
        console.log("Updated team created successfully");
      }
    }
  } catch (err) {
    console.error("Error during loading the team details :", err);
    throw err;
  }
}

/**
 *
 * @param {Update invitation details} userDetails
 * @returns
 */
async function rejectInvite(rejectInvitationReq) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("invitation");

    const objectId = new ObjectId(rejectInvitationReq.id);

    const invitationDetails = await col.findOne({ _id: objectId });
    console.log("invitationDetails: ", invitationDetails);

    let invitedUser;
    if (invitationDetails) {
      invitedUser = await fetchUserByEmail(invitationDetails?.inviteEmail);
      console.log("inviteUser: ", invitedUser);

      if (invitedUser?.status == "none") {
        const msg = "Invited user doesn't exist in TIVRA.";
        console.log(msg);
        return { status: "warn", message: msg };
      }
    }

    const updateOperation = {
      $set: {
        isApproved: false,
        isRejected: rejectInvitationReq.isRejected,
      },
    };

    console.log("reject invite request payload: ", updateOperation);
    const result = await col.updateOne({ _id: objectId }, updateOperation);

    if (result.modifiedCount === 1) {
      if (rejectInvitationReq.isRejected) {
        await removeMateFromTeam(invitationDetails, invitedUser);
      }

      return {
        valid: true,
        message: "Invitation updated successfully",
        result,
      };
    } else {
      return { valid: true, message: "no update in invite", result };
    }
  } catch (err) {
    console.error("Error updating invitation:", err);
    throw err;
  }
}

/**
 *
 * @param {Fetch team info config}
 * @returns
 */
async function removeMateFromTeam(invitationDetails, invitedUserDetail) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("team");

    const teamDetails = await col.findOne({
      userId: invitationDetails?.senderUserId,
    });
    console.log("teamDetails1: ", teamDetails);

    const teamMate = { team: { userId: invitedUserDetail?.userId } };
    console.log("team mate: ", teamMate);

    const result = await col.updateOne(
      { _id: teamDetails?._id },
      { $pull: teamMate }
    );

    console.log("teamDetails2: ", result);

    if (result.modifiedCount === 1) {
      console.log("Updated team created successfully");
    } else {
      console.log("user doesn't exist in a Team");
    }
  } catch (err) {
    console.error("Error during loading the team details :", err);
    throw err;
  }
}

/**
 *
 * @param {Save user details} userDetails
 * @returns
 */
async function saveSuperUser(userDetails) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("adminInvitedUser");

    const existingUser = await col.findOne({ email: userDetails.email });

    if (existingUser) {
      existingUser.isNewUser = false;
      console.log("User already exists:", existingUser);

      return existingUser;
    } else {
      const result = await col.insertOne(userDetails);
      result.isNewUser = result.acknowledged;

      console.log("User inserted successfully:", result);

      return result;
    }
  } catch (err) {
    console.error("Error saving super user:", err);
    throw err;
  }
}

/**
 *
 * @param {Save organization details} userDetails
 * @returns
 */
async function saveOrganization(organizationReq) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("organization");

    const existingOrg = await col.findOne({ npi: organizationReq.npi });

    if (existingOrg) {
      existingOrg.isNewOrg = false;
      console.log("Organization already exists:", existingOrg);

      return existingOrg;
    } else {
      const result = await col.insertOne(organizationReq);
      result.isNewOrg = result.acknowledged;

      console.log("organization inserted successfully:", result);

      return result;
    }
  } catch (err) {
    console.error("Error saving organization:", err);
    throw err;
  }
}

/**
 *
 * @param {load all organization by name}
 * @returns
 */
async function fetchOrganizationBy(userEnteredOrgName) {
  const client = await createDocDBConnection();
  console.log;
  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("organization");

    const organizations = await col
      .find({
        organizationName: { $regex: userEnteredOrgName, $options: "i" },
      })
      .toArray();

    console.log("Organization: ", organizations);

    if (organizations.length === 0) {
      return { data: [] };
    }

    return { data: organizations };
  } catch (err) {
    console.error("Error during Organization:", err);
    throw err;
  }
}

/**
 *
 * @param {load all the user roles}
 * @returns
 */
async function fetchAllUserRole() {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("userRoles");

    const userRoles = await col.find({}).toArray();
    console.log("User roles: ", userRoles);
    return userRoles;
  } catch (err) {
    console.error("Error during login:", err);
    throw err;
  }
}

/**
 *
 * @param {load all the user roles}
 * @returns
 */
async function fetchAllDeviceIcon() {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("deviceIcons");

    const userRoles = await col.find({}).toArray();
    console.log("Device icons: ", userRoles);
    return userRoles;
  } catch (err) {
    console.error("Error during loading Metric icons:", err);
    throw err;
  }
}

/**
 *
 * @param {load all the user roles}
 * @returns
 */
async function fetchAllMetricIcon() {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("metricIcons");

    const userRoles = await col.find({}).toArray();
    console.log("Metric icons: ", userRoles);
    return userRoles;
  } catch (err) {
    console.error("Error during loading Metric icons:", err);
    throw err;
  }
}

/**
 *
 * @returns Get all Icons
 */
async function getAllIcons() {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);
    const col = db.collection("icons");
    const icons = await col.find({}).toArray();

    return icons;
  } catch (err) {
    console.error("Error fetching get icons :", err);
    throw err;
  }
}

/**
 *
 * @param {Update configDetails} configDetails
 * @returns
 */
async function updateUserConfigDetails(configDetails) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("userDashboardConfigDetails");

    // Check if a user with the given email exists
    const existingUser = await col.findOne({ userId: configDetails.userId });

    if (existingUser) {
      if (existingUser.configData) {
        configDetails.configData.forEach((newPref) => {
          const existingPref = existingUser.configData.find(
            (e) => e.item === newPref.item
          );

          if (existingPref) {
            existingPref.user_device_id = newPref.user_device_id;
          } else {
            existingUser.configData.push(newPref);
          }
        });
      }

      const updatedUserData = {
        userId: configDetails.userId,
        configData: existingUser.configData,
      };

      const result = await col.updateOne(
        { userId: configDetails.userId },
        { $set: updatedUserData }
      );

      if (result.modifiedCount === 1) {
        return { message: "User configuration saved successfully" };
      } else {
        return { message: "Error processing request" };
      }
    } else {
      // If the user with the given email does not exist, insert a new user document
      const result = await col.insertOne({
        userId: configDetails.userId,
        configData: configDetails.configData,
      });

      if (result.modifiedCount === 1) {
        return { message: "User configuration saved successfully" };
      } else {
        return { message: "Error processing request" };
      }
    }
  } catch (err) {
    console.error("Error saving User configuration :", err);
    throw err;
  }
}

/**
 *
 * @param {Fetch user config} userConfigDetails
 * @returns
 */
async function fetchUserConfigDetails(userId) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("userDashboardConfigDetails");

    const userconfig = await col.findOne({ userId: userId });

    if (!userconfig) {
      return { status: "empty", message: "User configuration not found" };
    }
    console.log("userconfig: ", userconfig);

    return userconfig;
  } catch (err) {
    console.error("Error during User configuration :", err);
    throw err;
  }
}

/**
 *
 * @param {Update dashboard preference} userDashboardPreference
 * @returns
 */
async function updateUserDashboardPreferences(preferences) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("userDashboardPreferences");

    // Check if a user with the given email exists
    const existingUser = await col.findOne({ userId: preferences.userId });

    if (existingUser) {
      if (existingUser.preference) {
        preferences.preference.forEach((newPref) => {
          const existingPref = existingUser.preference.find(
            (e) => e.item === newPref.item
          );

          if (existingPref) {
            existingPref.isPreferred = newPref.isPreferred;
          } else {
            existingUser.preference.push(newPref);
          }
        });
      }

      const updatedUserData = {
        userId: preferences.userId,
        preference: existingUser.preference,
      };
      const result = await col.updateOne(
        { userId: preferences.userId },
        { $set: updatedUserData }
      );

      if (result.modifiedCount === 1) {
        return { message: "User dashboard preferences saved successfully" };
      } else {
        return { message: "Error processing request" };
      }
    } else {
      // If the user with the given email does not exist, insert a new user document
      const result = await col.insertOne({
        userId: preferences.userId,
        preference: preferences.preference,
      });

      if (result.modifiedCount === 1) {
        return { message: "User dashboard preferences saved successfully" };
      } else {
        return { message: "Error processing request" };
      }
    }
  } catch (err) {
    console.error("Error saving User dashboard preferences :", err);
    throw err;
  }
}
/**
 *
 * @param {Fetch user dashboard preferences} userDashboardPreferences
 * @returns
 */
async function fetchUserDashboardPreferences(userId) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("userDashboardPreferences");

    const userconfig = await col.findOne({ userId: userId });

    if (!userconfig) {
      return {
        status: "empty",
        message: "User dashboard preferences not found",
      };
    }

    return userconfig;
  } catch (err) {
    console.error("Error during User dashboard preferences :", err);
    throw err;
  }
}
/**
 *
 * @param {Update team preferences} userTeamPreferences
 * @returns
 */
async function updateUserTeamPreferences(preferences) {
  const client = await createDocDBConnection();

  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("userTeamPreferences");

    // Check if a user with the given email exists
    const existingUser = await col.findOne({ userId: preferences.userId });

    if (existingUser) {
      if (existingUser.preference) {
        preferences.preference.forEach((newPref) => {
          const existingPref = existingUser.preference.find(
            (e) => e.item === newPref.item
          );

          if (existingPref) {
            existingPref.isPreferred = newPref.isPreferred;
          } else {
            existingUser.preference.push(newPref);
          }
        });
      }
      const updatedUserData = {
        userId: preferences.userId,
        preference: existingUser.preference,
      };
      const result = await col.updateOne(
        { userId: preferences.userId },
        { $set: updatedUserData }
      );

      if (result.modifiedCount === 1) {
        return { message: "User team preferences saved successfully" };
      } else {
        return { message: "Error processing the update request" };
      }
    } else {
      // insert a new user document
      const result = await col.insertOne({
        userId: preferences.userId,
        preference: preferences.preference,
      });

      if (result.modifiedCount === 1) {
        return { message: "User team preferences saved successfully" };
      } else {
        return { message: "Error processing new request" };
      }
    }
  } catch (err) {
    console.error("Error saving User team preferences :", err);
    throw err;
  }
}

/**
 *
 * @param {Fetch user team preferences} userTeamPreferences
 * @returns
 */
async function fetchUserTeamPreferences(userId) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("userTeamPreferences");

    const userconfig = await col.findOne({ userId: userId });

    if (!userconfig) {
      return { status: "empty", message: "User team preferences not found" };
    }

    return userconfig;
  } catch (err) {
    console.error("Error during User dashboard preferences :", err);
    throw err;
  }
}

async function fetchDashboardMetricDataConfig(userId) {
  const client = await createDocDBConnection();

  try {
    // Specify the database to be used
    const db = client.db(dbName);

    // Specify the collection to be used
    const col = db.collection("dashboardMetricDataConfig");
    // Find and return user roles from the collection
    const dashboardMetricDataConfig = await col.find({}).toArray();

    return dashboardMetricDataConfig;
  } catch (err) {
    console.error("Error fetching get dashboardMetricDataConfig :", err);
    throw err;
  }
}
async function fetchDashboardMetricsDevicesConfig(userId) {
  const client = await createDocDBConnection();

  try {
    // Specify the database to be used
    const db = client.db(dbName);

    // Specify the collection to be used
    const col = db.collection("dashboardMetricsDevicesConfig");
    // Find and return user roles from the collection
    const dashboardMetricDataConfig = await col.find({}).toArray();

    return dashboardMetricDataConfig;
  } catch (err) {
    console.error("Error fetching get dashboardMetricsDevicesConfig :", err);
    throw err;
  }
}
async function fetchUserDashboardMetricConfig(userId) {
  const resp = await fetchUserConfigDetails(userId);
  return resp;
}

async function fetchTerraData(userId) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);

    const TerraAPIDataTablecol = db.collection("terraData");
    const TerraAPIDataTable = await TerraAPIDataTablecol.find({}).toArray();

    return TerraAPIDataTable;
  } catch (err) {
    console.error("Error fetching get TerraAPIDataTable :", err);
    throw err;
  }
}

async function fetchUserGoalThresholdConfig(userId) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);

    const col = db.collection("userGoalThresholdConfig");

    const userGoalThresholdConfig = await col.find({}).toArray();

    return userGoalThresholdConfig;
  } catch (err) {
    console.error("Error fetching get userGoalThresholdConfig :", err);
    throw err;
  }
}

/**
 *
 * @param {Fetch team info config}
 * @returns
 */
async function fetchTeamDetails(userId) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("team");

    const teamDetails = await col.findOne({ userId: userId });

    if (!teamDetails) {
      return { status: "empty", message: "Team doesn't exist" };
    }
    console.log("teamDetails: ", teamDetails);

    let teamInfo = [];

    const promise = teamDetails?.team.map(async (teamMate) => {
      const mateDetail = await fetchUser(teamMate.userId);
      if (mateDetail) {
        teamInfo.push({
          id: userId,
          mateId: teamMate.userId,
          player: {
            name: teamMate.name,
            icon: mateDetail.profileImage,
            active: teamMate.active,
          },
        });
      }
    });

    await Promise.all(promise);

    return teamInfo;
  } catch (err) {
    console.error("Error during loading the team details :", err);
    throw err;
  }
}

/**
 *
 * @param {Update the status of the device}
 * @returns
 */
async function updateDeviceStatus(deviceUpdateReqBody) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("userDevices");

    const result = await col.updateOne(
      {
        userId: deviceUpdateReqBody.tivraUserId,
        "device.terraDeviceUserId": deviceUpdateReqBody.terraDeviceUserId,
      },
      {
        $set: {
          "device.$.active": deviceUpdateReqBody.active,
        },
      }
    );

    let msg;
    if (result.modifiedCount === 1) {
      msg = {
        status: true,
        message: "successfully update the status of the device",
      };
      console.log(msg);
    } else {
      msg = {
        status: false,
        message: "no update on device",
      };
      console.log(msg);
    }
    return msg;
  } catch (err) {
    console.error("Error during the update of the status of device:", err);
    throw err;
  }
}

/**
 *
 * @param {Remove device from the list}
 * @returns
 */
async function removeDevice(terraDeviceUserId, tivraUserId) {
  const client = await createDocDBConnection();

  try {
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection("userDevices");

    const result = await col.updateOne(
      {
        userId: tivraUserId,
        "device.terraDeviceUserId": terraDeviceUserId,
      },
      {
        $pull: {
          device: {
            terraDeviceUserId: terraDeviceUserId,
          },
        },
      }
    );

    let msg;
    if (result.modifiedCount === 1) {
      msg = {
        status: true,
        message: "successfully deleted the device",
      };
      console.log(msg);
    } else {
      msg = {
        status: false,
        message: "unable to delete the device",
      };
      console.log(msg);
    }
    return msg;
  } catch (err) {
    console.error("Error during deleting the user:", err);
    throw err;
  }
}

/**
 *
 * @param {get tivra user data}
 * @returns
 */
async function getTivraUserData(collectionname, pipelineQuery) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);

    const col = db.collection(collectionname);
    const data = await col.aggregate(pipelineQuery).toArray();

    return data;
  } catch (err) {
    console.error("Error fetching get TerraAPIDataTable :", err);
    throw err;
  }
}
/**
 *
 * @param {update Payment status}
 * @returns
 */
async function updatePaymentStatus(userId, status) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);

    const col = db.collection("userPaymentStatus");
    const existingUser = await col.findOne({
      userId: userId
    });

    if (existingUser) {
      const result = await col.updateOne(
        { userId: userId },
        {
          $set: {
            paymentStatus: status,
          },
        }
      );

      if (result.modifiedCount === 1) {
        msg = {
          status: "success",
          message: "payment status updated successfully",
        };
        console.log(msg);
      } else {
        msg = {
          status: "warn",
          message: "unable to update payment status",
        };
        console.log(msg);
      }
      return result;
    } else {
      const body = {
        userId: userId, paymentStatus: status

      };
      const result = await col.insertOne(body);

      console.log("Device registered successfully:", result);

      return result;
    }
  } catch (err) {
    console.error("Error fetching updatePaymentStatus :", err);
    throw err;
  }
}
/**
 *
 * @param {get Payment status}
 * @returns
 */
async function getPaymentStatus(userId) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);

    const col = db.collection("userPaymentStatus");
    const result = await col.findOne({ userId: userId });

    return result;
  } catch (err) {
    console.error("Error fetching getPaymentStatus :", err);
    throw err;
  }
}

/**
 *
 * @param {update user timezone}
 * @returns
 */
async function updateUserTimeZone(userId, timezone) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);

    const col = db.collection("userTimeZones");
    const existingUser = await col.findOne({
      userId: userId
    });

    if (existingUser) {
      const result = await col.updateOne(
        { userId: userId },
        {
          $set: {
            timeZone: timezone,
          },
        }
      );

      if (result.modifiedCount === 1) {
        msg = {
          status: "success",
          message: "User time zone updated successfully",
        };
        console.log(msg);
      } else {
        msg = {
          status: "warn",
          message: "unable to update user timezone",
        };
        console.log(msg);
      }
      return result;
    } else {
      const body = {
        userId: userId, timeZone: timezone

      };
      const result = await col.insertOne(body);

      console.log("User timezone updated successfully:", result);

      return result;
    }
  } catch (err) {
    console.error("Error fetching user timezone :", err);
    throw err;
  }
}
/**
 *
 * @param {get User timezone}
 * @returns
 */
async function getUserTimeZone(userId) {
  const client = await createDocDBConnection();

  try {
    const db = client.db(dbName);

    const col = db.collection("userTimeZones");
    const result = await col.findOne({ userId: userId });

    return result;
  } catch (err) {
    console.error("Error fetching user timezone :", err);
    throw err;
  }
}
/**
 *
 * @param {get Filtered live data}
 * @returns
 */
async function fetchLiveData(userId, isTeam, timeoffset) {
  const userDashboardConfig = await fetchUserDashboardMetricConfig(userId);
  var userDashboardPreferences;
  if (isTeam) {
    userDashboardPreferences = await fetchUserTeamPreferences(userId);
  }
  else {
    userDashboardPreferences = await fetchUserDashboardPreferences(userId);
  }
  if (userDashboardPreferences?.status == "empty") {
    return {
      status: "empty",
      message: "No dashboard preference set for given user id",
    };
  }
  const dashboardMetricDataConfig = await fetchDashboardMetricDataConfig(userId);
  const devices = await loadUserSpecificDevices(userId);
  const paymentPlans = await loadPaymentRolePlans();
  const userGoalThresholdConfig = await fetchUserGoalThresholdConfig(userId);
  const userData = await fetchUser(userId);
  const usertimeZone = await getUserTimeZone(userId);


  var dashboardData = {};
  var stepsCount = ""
  var heartRate = ""
  var calories = ""
  var date;
  console.log("Dash board preference list " + JSON.stringify(userDashboardPreferences.preference));
  await Promise.all(dashboardMetricDataConfig.map(async function (config) {
    var filteredDashboardPreferenceConfig =
      userDashboardPreferences.preference.filter(function (el) {
        return el.item == config.key && el.isPreferred && el.active;
      });
    console.log("config data key " + config.key);
    if (filteredDashboardPreferenceConfig.length > 0) {
      console.log("Dash board preference " + config.key);
      var filteredDashboardConfig = userDashboardConfig.configData.filter(
        function (el) {
          return el.item == config.key;
        }
      );
      if (filteredDashboardConfig.length == 0) {
        return {
          status: "empty",
          message: "No dashboard preference set for given user id",
        };
      }
      console.log("config data key " + config.dataSource);
      console.log("config data key type " + config.dataType);
      console.log("config data key deviceMake " + filteredDashboardConfig[0].user_device_id);
      if (devices == null) {
        return {
          status: "empty",
          message: "No active devices set for given user id",
        };
      }
      console.log("devices " + JSON.stringify(devices));
      var filteredDevicedata = devices.device.filter(function (el) {
        return (
          el.deviceMake == filteredDashboardConfig[0].user_device_id
        );
      });
      if (filteredDevicedata.length == 0) {
        return {
          status: "empty",
          message: "No active devices set for given user id",
        };
      }
      console.log("pipelineQuery userId " + userId);
      console.log("pipelineQuery provider " + filteredDevicedata[0].deviceMake.toUpperCase());
      var pipelineQuery = []
      if (config.dashboardSection == "nutrition") {
        var today = new Date().getFullYear() + "-" + parseInt(new Date().getUTCMonth() + 1) + "-" + new Date().getUTCDate();
        var tomorrow = new Date().getFullYear() + "-" + parseInt(new Date().getUTCMonth() + 1) + "-" + parseInt(new Date().getUTCDate() + 1);
        // if (timeoffset) {
        // var todayoffset = moment.utc(today).utcOffset(timeoffset).format("YYYY-MM-DD");
        // console.log("today " + today)
        // console.log("timeoffset " + timeoffset)
        // console.log("timeoffset old  " + moment.utc(today).utcOffset(timeoffset).format())
        // console.log("todayoffset " + todayoffset)
        // console.log("moment guess " + moment.tz.guess())
        // console.log("moment date  " + moment.tz(new Date(), "America/New_York").format())
        // console.log("moment date formatted  " + moment.tz(new Date(), "America/New_York").format("YYYY-MM-DD"))
        // console.log("moment tomorrow date formatted  " + moment.utc().startOf('day').add(1, 'days').add(8, 'hours').format('YYYY-MM-DD'))
        // today = todayoffset.getFullYear() + "-" + parseInt(todayoffset.getMonth() + 1) + "-" + todayoffset.getDate();
        // var tomorrowoffset = moment.utc(tomorrow).utcOffset(timeoffset).format();
        // tomorrow = todayoffset.getFullYear() + "-" + parseInt(todayoffset.getMonth() + 1) + "-" + todayoffset.getDate();
        if (usertimeZone.timeZone) {
          today = moment.tz(new Date(), usertimeZone.timeZone).format("YYYY-MM-DD");
        }
        else {
          today = moment.tz(new Date(), "America/New_York").format("YYYY-MM-DD");
        }
        tomorrow = moment.utc().startOf('day').add(1, 'days').add(8, 'hours').format('YYYY-MM-DD');
        //}
        pipelineQuery = [
          {
            $match: {
              userId: userId,
              // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
            },
          },
          {
            $match: {
              $or: [{ provider: filteredDevicedata[0].deviceMake.toUpperCase() }, { provider: "SYSTEM" }]
              ,
            },
          },
          {
            $match: {
              timestamp: {
                $gte: new Date(today),
                $lte: new Date(tomorrow)
              }
            }
          },
          {
            $addFields: {
              convertedValue: { $toDouble: "$value" }
            }
          },
          {
            $group: {
              _id: {
                // $dayOfMonth: "$timestamp" 
                // $dateToString: { format: "%d-%m-%Y", date: "$timestamp" }
                // $hour: "$timestamp"
                // $dateToString: { format: "%d", date: "$timestamp" }
                $dateToString: {
                  format: "%Y-%m-%d", date: {
                    $toDate: "$timestamp"
                  }
                }
              },
              value: { $sum: "$convertedValue" }
              // totalValue: {
              //   $sum: {
              //     "$toDecimal": "$convertedValue"
              //   }
              // }
              // average: {
              //   $avg: {
              //     $toDecimal: "$value" //If price has decimals, it has higher precision than toDouble
              //   }
              // }
            }
          },
          // {
          //   $project: {
          //     number: {
          //       $divide: [
          //         {
          //           $trunc: {
          //             $multiply: [
          //               "$totalValue",
          //               10
          //             ]
          //           }
          //         },
          //         10
          //       ]
          //     }
          //   }
          // },
          // {
          //   $addFields: {
          //     value: {
          //       $toString: "$number"
          //     }
          //   }
          // }
          // {
          //   $project: {
          //     _id: 1,
          //     value: {
          //       $abs: //You can decide your precision
          //         "$average.toDecimal"
          //     }
          //   }
          // }
          // {
          //   $sort: {
          //     timestamp: -1
          //   }
          // },
          // {
          //   $limit: 1
          // }
        ];
      }
      else {
        var today = new Date().getFullYear() + "-" + parseInt(new Date().getUTCMonth() + 1) + "-" + new Date().getUTCDate();
        var tomorrow = new Date().getFullYear() + "-" + parseInt(new Date().getUTCMonth() + 1) + "-" + parseInt(new Date().getUTCDate() + 1)
        // if (timeoffset) {
        // var todayoffset = moment.utc(today).utcOffset(timeoffset).format();
        // today = todayoffset.getFullYear() + "-" + parseInt(todayoffset.getMonth() + 1) + "-" + todayoffset.getDate();
        // var tomorrowoffset = moment.utc(tomorrow).utcOffset(timeoffset).format();
        // tomorrow = todayoffset.getFullYear() + "-" + parseInt(todayoffset.getMonth() + 1) + "-" + todayoffset.getDate();
        if (usertimeZone.timeZone) {
          today = moment.tz(new Date(), usertimeZone.timeZone).format("YYYY-MM-DD");
        }
        else {
          today = moment.tz(new Date(), "America/New_York").format("YYYY-MM-DD");
        } tomorrow = moment.utc().startOf('day').add(1, 'days').add(8, 'hours').format('YYYY-MM-DD');
        //  }

        pipelineQuery = [
          {
            $match: {
              userId: userId,
              // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
            },
          },
          {
            $match: {
              provider: filteredDevicedata[0].deviceMake.toUpperCase(),
            },
          },
          {
            $match: {
              timestamp: {
                $gte: new Date(today),
                $lte: new Date(tomorrow)
              }
            }
          },
          {
            $addFields: {
              date: {
                $cond: {
                  if: { $eq: [{ $type: "$timestamp" }, "string"] },
                  then: {
                    $dateFromString: {
                      dateString: "$timestamp"
                    }
                  },
                  else: "$timestamp"
                }
              }
            }
          },
          // {
          //   $addFields: {
          //     date: { $toDate: "$timestamp" }
          //   }
          // },
          //   {
          //     $project: {
          //        date: {
          //           $dateFromString: {
          //              dateString: '$timestamp'
          //           }
          //        }
          //     }
          //  },
          {
            $sort: {
              date: -1
            }
          },
          {
            $limit: 1
          }
        ];
      }


      console.log("pipelineQuery  " + JSON.stringify(pipelineQuery));
      // const db = client.db(dbName);
      // const col = db.collection("tivra" + config.key + "Samples");
      // const user = await col.aggregate(pipelineQuery).toArray();
      const user = await getTivraUserData("tivra" + config.key + "Samples", pipelineQuery);

      console.log("pipelineQuery user  " + JSON.stringify(user));
      // if (user.length == 0) {
      //   return { message: "no data not found" };
      // }
      if (dashboardData[config.dashboardSection] == undefined) {
        dashboardData[config.dashboardSection] = [];
        console.log("dashboardData 1");
      }
      var dashboardObj = {};
      dashboardObj["key"] = config.key;
      dashboardObj["active"] = config.active;
      dashboardObj["icon"] = config.icon;
      dashboardObj["label"] = config.label;
      if (user.length > 0 && user[0].value && user[0].value != "") {
        dashboardObj["secondaryValue"] = config.measure;
        var val;
        if (config.key == "Weight") {
          val = (parseFloat(user[0].value) * 2.20462).toFixed(1);;
        }
        if (config.key == "Running") {
          val = (parseFloat(user[0].value) * 1000 * 0.621371).toFixed(1);;
        }
        if (config.key == "Distance") {
          val = ((parseFloat(user[0].value) / 1000) * 0.621371).toFixed(1);;
        }
        if (config.key == "Temperature") {
          if (user[0].value != "") {
            val = (parseFloat(user[0].value) * (5 / 9)).toFixed(1);
          }
        }
        if (config.key == "Sleep") {
          d = Number(user[0].value);
          var h = Math.floor(d / 3600);
          var m = Math.floor(d % 3600 / 60);
          var s = Math.floor(d % 3600 % 60);

          var hDisplay = h > 0 ? h + (h == 1 ? " : " : " : ") : "";
          var mDisplay = m;
          // var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
          val = hDisplay + mDisplay;
        }
        if (config.key == "Activities") {
          d = Number(user[0].value);
          var m = Math.floor(d / 60);
          // var mDisplay = m > 0 ? m + (m == 1 ? " m " : " m ") : "";
          var mDisplay = m > 0 ? m + (m == 1 ? "" : "") : "";

          val = mDisplay
        }
        if (config.key == "Stepscount") {
          stepsCount = (parseFloat(user[0].value)).toFixed(0).toString();
        }
        if (config.key == "Heartrate") {
          heartRate = (parseFloat(user[0].value)).toFixed(0).toString();
        }
        if (config.key == "Calories") {
          calories = (parseFloat(user[0].value)).toFixed(0).toString();
        }
        if (config.dashboardSection == "nutrition") {
          val = (parseFloat(user[0].value)).toFixed(1)
        }

        var WholeNumberArray = ["BodyBattery", "Pulse", "VO2Max", "Stepscount", "BP", "Stress", "HRV", "RestingHeartRate", "Calories", "CaloriesConsumed", "Fat", "Weight", "Heartrate", "Saturatedfat", "Carbohydrates"]
        if (config.key in WholeNumberArray) {
          if (config.key == "BP") {
            if (val) {
              dashboardObj["value"] = val
            }
            else {
              dashboardObj["value"] = user[0].value
            }
          }
          else {
            if (val) {
              dashboardObj["value"] = (parseFloat(val)).toFixed(0).toString();
            }
            else {
              dashboardObj["value"] = (parseFloat(user[0].value)).toFixed(0).toString();
            }
          }

        }
        else {
          if (val) {
            dashboardObj["value"] = (parseFloat(val)).toFixed(1).toString();
          }
          else {
            dashboardObj["value"] = (parseFloat(user[0].value)).toFixed(1).toString();
          }
        }


        // dashboardObj["value"] = user[0].value;
        // if (config.measure) {
        //   dashboardObj["value"] = user[0].value + " " + config.measure;
        // }


        console.log("dashboardData 2 " + config.key);
      }
      else {
        if (config.key == "Weight") {
          var weight = userData.healthFitness ? userData.healthFitness.weight : "";
          if (weight != "") {
            var val = (parseFloat(weight)).toFixed(1);;
            dashboardObj["value"] = val;
            dashboardObj["secondaryValue"] = config.measure;
          }
          else {
            dashboardObj["value"] = "NA";
          }
        }
        else {
          dashboardObj["value"] = "NA";
        }
        console.log("dashboardData 3 " + config.key);
      }
      dashboardData[config.dashboardSection].push(dashboardObj);
      console.log("dashboardData 4 inserted");
      // console.log("TestUserDATA " + JSON.stringify(user));

    }
  }));


  // const contents = await Promise.all(dashboardData);

  console.log("TestUserDATA " + JSON.stringify(dashboardData));
  // console.log("TestUserDATA1 " + JSON.stringify(contents));





  if (Object.keys(dashboardData).length === 0) {
    return {
      status: "empty",
      message: "No data available for given user id",
    };
  } else {
    console.log("isTeam ", isTeam)
    console.log("userData ", JSON.stringify(userData))
    console.log("paymentPlans ", JSON.stringify(paymentPlans))

    var paymentPlan = paymentPlans.filter(function (el) {
      return (
        el.id == userData.paymentPlanRole.roleId
      );
    });
    if (isTeam) {
      dashboardData["teamInfo"] = {
        name: userData.firstName + " " + userData.middleName + " " + userData.lastName,
        age: "47",
        plan: paymentPlan.length > 0 ? paymentPlan[0].roleName : "",
        weight: userData.healthFitness ? userData.healthFitness.weight : "",
        height: userData.healthFitness ? userData.healthFitness.height : "",
        stepscount: stepsCount,
        heartrate: heartRate,
        calories: calories,
      };
    }
    else {
      dashboardData["dashboardInfo"] = {
        name: userData.firstName + " " + userData.middleName + " " + userData.lastName,
        age: "47",
        plan: paymentPlan.length > 0 ? paymentPlan[0].roleName : "",
        weight: userData.healthFitness ? userData.healthFitness.weight : "",
        height: userData.healthFitness ? userData.healthFitness.height : "",
        stepscount: stepsCount,
        heartrate: heartRate,
        calories: calories,
      };
    }

    console.log("dashboard data " + JSON.stringify(dashboardData));
    dashboardData["user_id"] = userId;
    dashboardData["timestamp"] = date;

    return dashboardData;
  }
}

/**
 *
 * @param {get Filtered live data}
 * @returns
 */
async function fetchFilterData(userId, filter, isTeam) {
  const userDashboardConfig = await fetchUserDashboardMetricConfig(userId);
  var userDashboardPreferences;
  if (isTeam) {
    userDashboardPreferences = await fetchUserTeamPreferences(userId);
  }
  else {
    userDashboardPreferences = await fetchUserDashboardPreferences(userId);
  } if (userDashboardPreferences?.status == "empty") {
    return {
      status: "empty",
      message: "No dashboard preference set for given user id",
    };
  }
  const dashboardMetricDataConfig = await fetchDashboardMetricDataConfig(userId);
  const devices = await loadUserSpecificDevices(userId);
  const userGoalThresholdConfig = await fetchUserGoalThresholdConfig(
    userId
  );
  const userData = await fetchUser(userId);
  const usertimeZone = await getUserTimeZone(userId);

  var date = new Date().getFullYear() + "-" + parseInt(new Date().getUTCMonth() + 1) + "-" + new Date().getUTCDate();
  const nutritionLogDetails = await loadNutritionLogBy(userId, date);

  var dashboardData = {};
  var stepsCount = ""
  var heartRate = ""
  var calories = ""
  var date;
  console.log("Dash board preference list " + JSON.stringify(userDashboardPreferences.preference));
  await Promise.all(dashboardMetricDataConfig.map(async function (config) {
    var filteredDashboardPreferenceConfig =
      userDashboardPreferences.preference.filter(function (el) {
        return el.item == config.key && el.isPreferred && el.active;
      });
    console.log("config data key " + config.key);
    if (filteredDashboardPreferenceConfig.length > 0 && config.key!="BP") {
      console.log("Dash board preference " + config.key);
      var filteredDashboardConfig = userDashboardConfig.configData.filter(
        function (el) {
          return el.item == config.key;
        }
      );
      if (filteredDashboardConfig.length == 0) {
        return {
          status: "empty",
          message: "No dashboard preference set for given user id",
        };
      }
      console.log("config data key " + config.dataSource);
      console.log("config data key type " + config.dataType);
      console.log("config data key deviceMake " + filteredDashboardConfig[0].user_device_id);
      if (devices == null) {
        return {
          status: "empty",
          message: "No active devices set for given user id",
        };
      }
      console.log("devices " + JSON.stringify(devices));
      var filteredDevicedata = devices.device.filter(function (el) {
        return (
          el.deviceMake == filteredDashboardConfig[0].user_device_id
        );
      });
      if (filteredDevicedata.length == 0) {
        return {
          status: "empty",
          message: "No active devices set for given user id",
        };
      }
      console.log("pipelineQuery userId " + userId);
      console.log("pipelineQuery provider " + filteredDevicedata[0].deviceMake.toUpperCase());
      var pipelineQuery = []
      var filterItems = [];
      if (filter == "hourly") {
        var dateVal = new Date().getFullYear() + "-" + parseInt(new Date().getUTCMonth() + 1) + "-" + new Date().getUTCDate();
        var tomorrow = new Date().getFullYear() + "-" + parseInt(new Date().getUTCMonth() + 1) + "-" + parseInt(new Date().getUTCDate() + 1);
        var hour;
        if (usertimeZone.timeZone) {
          dateVal = moment.tz(new Date(), usertimeZone.timeZone).format("YYYY-MM-DD");
          hour = moment.tz(new Date(), usertimeZone.timeZone).format("YYYY-MM-DD HH:MM:SS").split(" ")[1].split(":")[0];
          console.log("dateVal  " + moment.tz(new Date(), usertimeZone.timeZone).format("YYYY-MM-DD HH:MM:SS"));
        }
        else {
          dateVal = moment.tz(new Date(), "America/New_York").format("YYYY-MM-DD");
          hour = moment.tz(new Date(), "America/New_York").format("YYYY-MM-DD HH:MM:SS").split(" ")[1].split(":")[0];
          console.log("dateVal  " + moment.tz(new Date(), "America/New_York").format("YYYY-MM-DD HH:MM:SS"));
        }
        tomorrow = moment.utc().startOf('day').add(1, 'days').add(8, 'hours').format('YYYY-MM-DD');
        // var date = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
        // var hour = dateVal.getHours()
        console.log("dateVal hours " + hour);
        for (var i = 0; i <= parseInt(hour); i++) {
          filterItems.push(i);
        }
        if (config.dashboardSection == "nutrition") {
          pipelineQuery = [
            {
              $match: {
                userId: userId,
                // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
              },
            },
            {
              $match: {
                $or: [{ provider: filteredDevicedata[0].deviceMake.toUpperCase() }, { provider: "SYSTEM" }]
              },
            },
            {
              $match: {
                timestamp: {
                  $gte: new Date(dateVal),
                  $lte: new Date(tomorrow)
                }
              }
            },
            {
              $addFields: {
                convertedValue: { $toDouble: "$value" },
                date: {
                  $cond: {
                    if: { $eq: [{ $type: "$timestamp" }, "string"] },
                    then: {
                      $dateFromString: {
                        dateString: "$timestamp"
                      }
                    },
                    else: "$timestamp"
                  }
                }
              }
            },
            {
              $group: {
                _id: {
                  $hour: "$date"
                },
                value: { $avg: "$convertedValue" }
              }
            },
            // { $sort: { timestamp: -1 } }
          ];
        }
        else {
          pipelineQuery = [
            {
              $match: {
                userId: userId,
                // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
              },
            },
            {
              $match: {
                provider: filteredDevicedata[0].deviceMake.toUpperCase(),
              },
            },
            {
              $match: {
                timestamp: {
                  $gte: new Date(dateVal),
                  $lte: new Date(tomorrow)
                }
              }
            },
            {
              $addFields: {
                convertedValue: { $toDouble: "$value" },
                date: {
                  $cond: {
                    if: { $eq: [{ $type: "$timestamp" }, "string"] },
                    then: {
                      $dateFromString: {
                        dateString: "$timestamp"
                      }
                    },
                    else: "$timestamp"
                  }
                }
              }
            },
            {
              $group: {
                _id: {
                  $hour: "$date"
                },
                value: { $avg: "$convertedValue" }
              }
            },
            // { $sort: { timestamp: -1 } }
          ];
        }

      }
      if (filter == "weekly") {
        var curr = new Date(); // get current date
        // var first = curr.getDate() - curr.getDay();
        var first = curr.getDate();
        var last = first - 6; // last day is the first day + 6

        var firstday = new Date(curr.setDate(last)).toUTCString();
        var lastday = new Date(curr.setDate(first)).toUTCString();
        // for (let q = first; q >= last; q.setDate(q.getDate() + 1)) {
        //   filterItems.push(q.getUTCDate() + "-" + parseInt(q.getUTCMonth() + 1) + "-" + new Date().getFullYear());
        // }
        filterItems = [...Array(7)].map((_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - i)
          return d.getUTCDate().toString().padStart(2, "0") + "-" + parseInt(d.getUTCMonth() + 1).toString().padStart(2, "0") + "-" + d.getFullYear()
        })
        filterItems = filterItems.reverse();
        if (config.dashboardSection == "nutrition") {
          pipelineQuery = [
            {
              $match: {
                userId: userId,
                // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
              },
            },
            {
              $match: {
                $or: [{ provider: filteredDevicedata[0].deviceMake.toUpperCase() }, { provider: "SYSTEM" }]
              },
            },
            {
              $match: {
                timestamp: {
                  $gte: new Date(firstday),
                  $lte: new Date(lastday)
                }
              }
            },
            {
              $addFields: {
                convertedValue: { $toDouble: "$value" },
                date: {
                  $cond: {
                    if: { $eq: [{ $type: "$timestamp" }, "string"] },
                    then: {
                      $dateFromString: {
                        dateString: "$timestamp"
                      }
                    },
                    else: "$timestamp"
                  }
                }
              }
            },
            {
              $group: {
                _id: {
                  // $dayOfMonth: "$timestamp" 
                  $dateToString: { format: "%d-%m-%Y", date: "$date" }
                  // $hour: "$timestamp"
                  // $dateToString: { format: "%d", date: "$timestamp" }

                },
                value: { $avg: "$convertedValue" }
              }
            },
            //  { $sort: { timestamp: -1 } }
          ];
        }
        else {
          pipelineQuery = [
            {
              $match: {
                userId: userId,
                // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
              },
            },
            {
              $match: {
                provider: filteredDevicedata[0].deviceMake.toUpperCase(),
              },
            },
            {
              $match: {
                timestamp: {
                  $gte: new Date(firstday),
                  $lte: new Date(lastday)
                }
              }
            },
            {
              $addFields: {
                convertedValue: { $toDouble: "$value" },
                date: {
                  $cond: {
                    if: { $eq: [{ $type: "$timestamp" }, "string"] },
                    then: {
                      $dateFromString: {
                        dateString: "$timestamp"
                      }
                    },
                    else: "$timestamp"
                  }
                }
              }
            },
            {
              $group: {
                _id: {
                  // $dayOfMonth: "$timestamp" 
                  $dateToString: { format: "%d-%m-%Y", date: "$date" }
                  // $hour: "$timestamp"
                  // $dateToString: { format: "%d", date: "$timestamp" }

                },
                value: { $avg: "$convertedValue" }
              }
            },
            //  { $sort: { timestamp: -1 } }
          ];
        }

      }
      if (filter == "monthly") {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        // var firstDay = new Date(y, m, 1);
        // var lastDay = new Date(y, m + 1, 0);
        let lastDay = new Date();
        let firstDay = new Date();
        firstDay = new Date(firstDay.setMonth(lastDay.getMonth() - 3));
        console.log("Monthly firstDay " + firstDay)
        console.log("Monthly lastDay " + lastDay)

        for (let q = new Date(firstDay); q <= lastDay; q.setMonth(q.getMonth() + 1)) {
          console.log("Monthly filterItems 1 " + JSON.stringify(parseInt(q.getUTCMonth() + 1).toString().padStart(2, "0")));
          filterItems.push(parseInt(q.getUTCMonth() + 1).toString().padStart(2, "0"));
          // filterItems.push(q.getUTCDate().toString().padStart(2, "0") + "-" + parseInt(q.getUTCMonth() + 1).toString().padStart(2, "0") + "-" + new Date().getFullYear());
        }
        console.log("Monthly filterItems " + JSON.stringify(filterItems));

        if (config.dashboardSection == "nutrition") {
          pipelineQuery = [
            {
              $match: {
                userId: userId,
                // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
              },
            },
            {
              $match: {
                $or: [{ provider: filteredDevicedata[0].deviceMake.toUpperCase() }, { provider: "SYSTEM" }]
              },
            },
            {
              $match: {
                timestamp: {
                  $gte: new Date(firstDay),
                  $lte: new Date(lastDay)
                }
              }
            },
            {
              $addFields: {
                convertedValue: { $toDouble: "$value" },
                date: {
                  $cond: {
                    if: { $eq: [{ $type: "$timestamp" }, "string"] },
                    then: {
                      $dateFromString: {
                        dateString: "$timestamp"
                      }
                    },
                    else: "$timestamp"
                  }
                }
              }
            },
            {
              $group: {
                _id: {
                  // $dayOfMonth: "$timestamp" 
                  // $dateToString: { format: "%d-%m-%Y", date: "$date" }
                  $dateToString: { format: "%m", date: "$date" },
                  // $hour: "$timestamp"
                  // $dateToString: { format: "%d", date: "$timestamp" }

                },
                value: { $avg: "$convertedValue" }
              }
            },
            // { $sort: { timestamp: -1 } }
          ];
        }
        else {
          pipelineQuery = [
            {
              $match: {
                userId: userId,
                // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
              },
            },
            {
              $match: {
                provider: filteredDevicedata[0].deviceMake.toUpperCase(),
              },
            },
            {
              $match: {
                timestamp: {
                  $gte: new Date(firstDay),
                  $lte: new Date(lastDay)
                }
              }
            },
            {
              $addFields: {
                convertedValue: { $toDouble: "$value" },
                date: {
                  $cond: {
                    if: { $eq: [{ $type: "$timestamp" }, "string"] },
                    then: {
                      $dateFromString: {
                        dateString: "$timestamp"
                      }
                    },
                    else: "$timestamp"
                  }
                }
              }
            },
            {
              $group: {
                _id: {
                  // $dayOfMonth: "$timestamp" 
                  // $dateToString: { format: "%d-%m-%Y", date: "$date" }
                  $dateToString: { format: "%m", date: "$date" },
                  // $hour: "$timestamp"
                  // $dateToString: { format: "%d", date: "$timestamp" }

                },
                value: { $avg: "$convertedValue" }
              }
            },
            // { $sort: { timestamp: -1 } }
          ];
        }



      }
      if (filter == "yearly") {
        // var firstday = new Date(new Date().getFullYear(), 0, 1);
        // var lastday = new Date(new Date().getFullYear(), 11, 31);
        // for (let q = firstDay; q <= lastDay; q.setDate(q.getDate() + 1)) {
        //   filterItems.push(q.toLocaleString('default', { month: 'short' }));
        // }
        let lastDay = new Date();
        let firstDay = new Date();
        firstDay = new Date(firstDay.setFullYear(lastDay.getFullYear() - 3));
        console.log("yearly firstDay " + firstDay)
        console.log("yearly lastDay " + lastDay)
        for (let q = new Date(firstDay); q <= lastDay; q.setFullYear(q.getFullYear() + 1)) {
          filterItems.push(q.getFullYear());
          // filterItems.push(q.getUTCDate().toString().padStart(2, "0") + "-" + parseInt(q.getUTCMonth() + 1).toString().padStart(2, "0") + "-" + new Date().getFullYear());
        }
        console.log("yearly filterItems " + JSON.stringify(filterItems))

        // filterItems = [
        //   "January",
        //   "February",
        //   "March",
        //   "April",
        //   "May",
        //   "June",
        //   "July",
        //   "August",
        //   "September",
        //   "October",
        //   "November",
        //   "December",
        // ];

        if (config.dashboardSection == "nutrition") {
          pipelineQuery = [
            {
              $match: {
                userId: userId,
                // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
              },
            },
            {
              $match: {
                $or: [{ provider: filteredDevicedata[0].deviceMake.toUpperCase() }, { provider: "SYSTEM" }]
              },
            },
            {
              $match: {
                timestamp: {
                  $gte: firstDay,
                  $lte: lastDay
                }
              }
            },
            {
              $addFields: {
                convertedValue: { $toDouble: "$value" },
                date: {
                  $cond: {
                    if: { $eq: [{ $type: "$timestamp" }, "string"] },
                    then: {
                      $dateFromString: {
                        dateString: "$timestamp"
                      }
                    },
                    else: "$timestamp"
                  }
                }
              }
            },
            {
              $group: {
                _id: {
                  // $dayOfMonth: "$timestamp" 
                  // $dateToString: { format: "%d-%m-%Y", date: "$timestamp" }
                  // $hour: "$timestamp"
                  $dateToString: { format: "%Y", date: "$date" },


                },
                value: { $avg: "$convertedValue" }
              }
            },
            //  { $sort: { timestamp: -1 } }
          ];
        }
        else {
          pipelineQuery = [
            {
              $match: {
                userId: userId,
                // userId: "a3cfd7883e8e5f6c3991e5515ad27bcd96c9b24b71b6559b3edd15f2bd951d91",
              },
            },
            {
              $match: {
                provider: filteredDevicedata[0].deviceMake.toUpperCase(),
              },
            },
            {
              $match: {
                timestamp: {
                  $gte: firstDay,
                  $lte: lastDay
                }
              }
            },
            {
              $addFields: {
                convertedValue: { $toDouble: "$value" },
                date: {
                  $cond: {
                    if: { $eq: [{ $type: "$timestamp" }, "string"] },
                    then: {
                      $dateFromString: {
                        dateString: "$timestamp"
                      }
                    },
                    else: "$timestamp"
                  }
                }
              }
            },
            {
              $group: {
                _id: {
                  // $dayOfMonth: "$timestamp" 
                  // $dateToString: { format: "%d-%m-%Y", date: "$timestamp" }
                  // $hour: "$timestamp"
                  // $dateToString: { format: "%m", date: "$date" },
                  $dateToString: { format: "%Y", date: "$date" },



                },
                value: { $avg: "$convertedValue" }
              }
            },
            //  { $sort: { timestamp: -1 } }
          ];
        }

      }
      console.log("pipelineQuery  " + JSON.stringify(pipelineQuery));
      // const db = client.db(dbName);
      // const col = db.collection("tivra" + config.key + "Samples");
      // const user = await col.aggregate(pipelineQuery).toArray();
      const filterdata = await getTivraUserData("tivra" + config.key + "Samples", pipelineQuery);

      // if (user.length == 0) {
      //   return { message: "no data not found" };
      // }
      console.log("Testresults key " + config.key);
      console.log("Testresults  " + JSON.stringify(filterdata));
      var filtereDashboardConfig = userGoalThresholdConfig[0].threshold.filter(function (el) {
        return el.key == config.key;
      });
      if (dashboardData[config.dashboardSection] == undefined) {
        dashboardData[config.dashboardSection] = [];
        console.log("dashboardData 1");
      }
      var configData = []
      filterItems.forEach(function (value) {
        var configObj = {};
        var item = filterdata.find(temp => temp._id == value)
        if (item) {
          // console.log(target)
          var val;
          val = item.value;
          configObj["name"] = item._id;
          if (config.key == "Temperature") {
            // if (item.value != "") {
            //   val = 97.7 + (parseFloat(item.value) * (5 / 9)).toFixed(1);
            // }
          }
          if (config.key == "Sleep") {
            d = Number(item.value);
            val = parseFloat(d / 3600).toFixed(2)

          }
          if (config.key == "Activities") {
            d = Number(item.value);
            val = parseFloat(d / 60).toFixed(2)
          }
          configObj["value"] = val;
        }
        else {
          configObj["name"] = value;
          configObj["value"] = "0";
        }
        if (filtereDashboardConfig.length > 0) {
          var keys = Object.keys(filtereDashboardConfig[0].thresholds);
          keys.forEach(function (key) {
            configObj[key] = filtereDashboardConfig[0].thresholds[key];
          });
        }
        configData.push(configObj);
      });



      // if (filterdata.length > 0) {
      //   filterdata.forEach(function (item) {
      //     var configObj = {};
      //     configObj["name"] = item._id;
      //     configObj["value"] = item.value;
      //     if (filtereDashboardConfig.length > 0) {
      //       var keys = Object.keys(filtereDashboardConfig[0].thresholds);
      //       keys.forEach(function (key) {
      //         configObj[key] = filtereDashboardConfig[0].thresholds[key];
      //       });
      //     }
      //     configData.push(configObj);
      //   })
      // }
      // console.log("filterItems 1 " + JSON.stringify(filterItems));
      // console.log("config 1 " + JSON.stringify(configData));

      // filterItems.forEach(function (value) {
      //   if (!configData.some((config) => config.name == value)) {
      //     console.log("config 2 ");

      //     var configObj = {};
      //     configObj["name"] = value;
      //     configObj["value"] = "0";
      //     if (filtereDashboardConfig.length > 0) {
      //       var keys = Object.keys(filtereDashboardConfig[0].thresholds);
      //       keys.forEach(function (key) {
      //         configObj[key] = filtereDashboardConfig[0].thresholds[key];
      //       });
      //     }
      //     configData.push(configObj);
      //   }
      // });

      var dashboardObj = {};
      dashboardObj["key"] = config.key;
      dashboardObj["active"] = config.active;
      dashboardObj["icon"] = config.icon;
      dashboardObj["label"] = config.label;
      dashboardObj["data"] = configData;
      dashboardData[config.dashboardSection].push(dashboardObj);
      console.log("dashboardData 4 inserted");
      // console.log("TestUserDATA " + JSON.stringify(user));

    }
  }));


  // const contents = await Promise.all(dashboardData);

  console.log("TestUserDATA " + JSON.stringify(dashboardData));
  // console.log("TestUserDATA1 " + JSON.stringify(contents));





  if (Object.keys(dashboardData).length === 0) {
    return {
      status: "empty",
      message: "No data available for given user id",
    };
  } else {


    return dashboardData;
  }
}
module.exports = {
  loadPaymentRolePlans,
  loadDevices,
  saveUser,
  loginUser,
  fetchUser,
  saveWebhookData,
  updateUserRole,
  updateUserAccount,
  updateUserDemographic,
  updateUserSocialProfile,
  updateUserHealthFitnessProfile,
  updateUserCorporateAssociationProfile,
  loadNutritionLogBy,
  saveNutritionLog,
  saveInvite,
  getInvite,
  updateInvite,
  saveSuperUser,
  saveOrganization,
  fetchOrganizationBy,
  fetchAllUserRole,
  fetchAllDeviceIcon,
  fetchAllMetricIcon,
  saveTerraData,
  getAllIcons,
  updateUserConfigDetails,
  fetchUserConfigDetails,
  updateUserDashboardPreferences,
  fetchUserDashboardPreferences,
  updateUserTeamPreferences,
  fetchUserTeamPreferences,
  fetchDashboardMetricDataConfig,
  fetchDashboardMetricsDevicesConfig,
  fetchTerraData,
  fetchUserGoalThresholdConfig,
  fetchUserDashboardMetricConfig,
  fetchTeamDetails,
  loadUserSpecificDevices,
  updateNutritionLog,
  deleteNutritionLog,
  rejectInvite,
  registerDevices,
  updateDeviceStatus,
  removeDevice,
  getTivraUserData,
  updatePaymentStatus,
  getPaymentStatus,
  fetchUserByEmail,
  fetchLiveData,
  fetchFilterData,
  getUserTimeZone,
  updateUserTimeZone
};
