import StorageAdaptor from './StorageAdaptor';

var API_URL = "http://localhost:3000/";


function get(url){
  var receiveHeaders = {
    accept: 'application/json',
  };
  var completeHeaders = constructHeadersForRequest(receiveHeaders);

  return fetch(API_URL+url, {
    headers:completeHeaders
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(scrollDown);
}

function query(url,paramsObj){
  if(!isAuthenticated()){
    return "login"; //meaning a need to transition to Login
  }
  var headers = {
    accept: 'application/json',
  };
  var completeHeaders = constructHeadersForRequest(headers);
  return fetch(API_URL+url+constructQueryParams(paramsObj),{
    headers:completeHeaders
  }).then(checkStatus)
    .then(parseJSON);
}

function post(url,obj){
  var sendHeaders = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  };
  var completeHeaders=constructHeadersForRequest(sendHeaders);

  return fetch(API_URL+url,{
    headers: completeHeaders,
    method:"post",
    body:JSON.stringify(obj)
  }).then(checkStatus)
  .then(parseJSON);
}

function put(url,obj){
  var sendHeaders = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  };
  var completeHeaders=constructHeadersForRequest(sendHeaders);

  return fetch(API_URL+url,{
    headers: completeHeaders,
    method:"put",
    body:JSON.stringify(obj)
  }).then(checkStatus)
  .then(parseJSON);
}

function destroy(url){
  return fetch(API_URL+url,{
    headers:constructHeadersForRequest({}),
    method:"delete"
  }).then((checkStatus));
}

function checkStatus(response) {

  if (response.ok) {
    return response;
  }else if (response.status === 401) {
    deauthenticate();
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  throw error;

}

function deauthenticate(){
  StorageAdaptor.remove("current_user_data");
  StorageAdaptor.remove("authenticated");
  StorageAdaptor.remove("auth_details");
  //TODO: transition to login page
}

function getCurrentUserDetails(){
  return StorageAdaptor.getObject("current_user_data");
}

function isAuthenticated(){
  return StorageAdaptor.getItem("authenticated") === "true";
}

function constructHeadersForRequest(headers1){
  var authentication_headers=StorageAdaptor.getObject("auth_details");
  var headers = Object.assign(headers1,authentication_headers);
  return headers;
}

function parseJSON(response) {
  if(response){
    return response.json();
  }
  const error = new Error(`response body not parsable`);
  throw error;
}

function constructQueryParams(params){
  var paramsArr = [];
  for (var key in params){
    if(params[key]){
      paramsArr.push({
        key:key,
        value:params[key]
      });
    }
  }
  if (paramsArr.length === 0) {
    return "";
  }
  var firstParam = paramsArr.shift();

  var queryString="?"+firstParam.key+"="+firstParam.value;
  for (var indx in paramsArr){

    queryString+="&"+paramsArr[indx].key+"="+paramsArr[indx].value;
  }

  return queryString;
}

function scrollDown() {
  console.log("Is it working again?")
  window.scrollTo(0, document.body.scrollHeight)
  }
const AuthStore = {
  deauthenticate,
  get,
  query,
  post,
  put,
  destroy,
  isAuthenticated,
  getCurrentUserDetails,
  constructQueryParams,
  };
export default AuthStore;
