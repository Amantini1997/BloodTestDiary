/**
 * This module provides some functions for faster 
 * logging of different actions on the DB. 
 * 
 * @author Luka Kralj
 * @version 1.0
 * 
 * @module action-logger
 */

module.exports = {
    logInsert,
    logUpdate,
    logDelete,
    logOther,
    enableConsoleOutput,
    disableConsoleOutput
};

const  mysql = require('mysql');
const db_controller = require('./db_controller/db-controller');
const dateFormat = require('dateformat');
const logger = require('./logger');

/** 
 * If true, it will output to the console, otherwise it will not output anything.
 * It's good to turn it off in testing to increase readability. Leave on for debugging.
 */
let showConsoleOutput = true;

function enableConsoleOutput() {
    showConsoleOutput = true;
}

function disableConsoleOutput() {
    showConsoleOutput = false;
}

/**
 * Call this to log an insert action.
 *
 * @param {string} username User that has done that action.
 * @param {string} tableName The table that was involved in the action.
 * @param {string} entryID The key of the entry from the previous table that was involved in the action.
 * @param {string} message Optional message that can provide more details about the action.
 * @param {function} Optional action, called with the result of insertQuery.
 */
function logInsert(username, tableName, entryID, message = undefined, callback = undefined) {
    log("insert", username, tableName, entryID, message, callback);
}

/**
 * Call this to log an update action.
 *
 * @param {string} username User that has done that action.
 * @param {string} tableName The table that was involved in the action.
 * @param {string} entryID The key of the entry from the previous table that was involved in the action.
 * @param {string} message Optional message that can provide more details about the action.
 * @param {function} Optional action, called with the result of insertQuery.
 */
function logUpdate(username, tableName, entryID, message = undefined, callback = undefined) {
    log("update", username, tableName, entryID, message, callback);
}

/**
 * Call this to log a delete action.
 *
 * @param {string} username User that has done that action.
 * @param {string} tableName The table that was involved in the action.
 * @param {string} entryID The key of the entry from the previous table that was involved in the action.
 * @param {string} message Optional message that can provide more details about the action.
 * @param {function} Optional action, called with the result of insertQuery.
 */
function logDelete(username, tableName, entryID, message = undefined, callback = undefined) {
    log("delete", username, tableName, entryID, message, callback);
}

/**
 * Call this to log any other action. Say, requested editing, or attempted an invalid login etc.
 *
 * @param {string} username User that has done that action.
 * @param {string} tableName The table that was involved in the action.
 * @param {string} entryID The key of the entry from the previous table that was involved in the action.
 * @param {string} message Message that provides details about the action. In this case the message is compulsory 
 *                          as it needs to explain what happened.
 * @param {function} Optional action, called with the result of insertQuery.
 */
function logOther(username, tableName, entryID, message, callback = undefined) {
    if (message === undefined) {
        throw new Error("Invalid use of a logger function.");
    }
    log("other", username, tableName, entryID, message, callback);
}

/**
 * Helper function to reduce duplication.
 *
 * @param {string} type Type of action taken: insert, update or delete.
 * @param {string} username User that has done that action.
 * @param {string} tableName The table that was involved in the action.
 * @param {string} entryID The key of the entry from the previous table that was involved in the action.
 * @param {string} message Optional message that can provide more details about the action.
 * @param {function} Optional action, called with the result of insertQuery.
 */
function log(type, username, tableName, entryID, message = undefined, callback = undefined) {
    if (username === undefined || tableName === undefined || entryID === undefined) {
        throw new Error("Invalid use of a logger function.");
    }
    message = (message === undefined) ? "NULL" : message;
    let date = new Date();
    date = dateFormat(date, "yyyymmddHHMMss.lll");

    let sql = "INSERT INTO ActionLog " + 
        "(username, action_timestamp, action_type, table_affected, entry_affected, additional_info)" +
        "VALUES (?, ?, ?, ?, ?, ?)";
    sql = mysql.format(sql, [username, date, type, tableName, entryID, message]);

    let s = "";
    switch (type) {
        case "insert": s =  "inserted"; break;
        case "update": s =  "updated"; break;
        case "delete": s =  "deleted"; break;
        case "other": break;
        default: throw new Error("Invalid type.");
    }

    db_controller.insertQuery(sql)
    .then((result) => {
        if (showConsoleOutput) {
            message = (message === "NULL") ? "No message." : message;
            if (s.length > 0 && result.status === "OK") {
                logger.info("Log: user " + username + " " + s + " " + tableName + "(" + entryID + "): " + message);
            }
            else if (s.length > 0) {
                logger.error("ERROR logging: user " + username + " " + s + " " + tableName + "(" + entryID + "): " + message + ". Error: " + JSON.stringify(result.err));
            }
            else if (result.status === "OK") {
                logger.info("Log: user " + username + " committed other action: " + message);
            }
            else {
                logger.error("ERROR logging: user " + username + " committed other action: " + message + ". Error: " + JSON.stringify(result.err));
            }
        }

        if (callback) callback(result);
    });
}
