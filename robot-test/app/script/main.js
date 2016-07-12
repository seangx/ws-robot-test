/**
 * Created by Joker on 16/7/11.
 */
var WebSocket=require("ws");
var request=require("request");


request("http://120.131.64.91:30089/uid",function(error, response, body){
  if(error){
    console.log(error);
    return
  }
  var resBody=JSON.parse(body);
  if(!resBody.uid){
    console.log(body)
    return
  }
  var UID=resBody.uid

  var host="localhost";
  var conn= new WebSocket('ws://' + host + ':8080/ws');
  var handShake=function(){
    if(conn){
      var data={
        message_type:4,
        message_id:0,
        route:"",
        body:JSON.stringify({"uid":UID,"init_type":1,"app_name":"bombing_pig","key":"asdasd","other_data":{"are_you_ok":"hehe"}})
      };
      conn.send(JSON.stringify(data))
    }
  };
  conn.onopen=function(){
    console.log("on socket open");
    handShake();
    heartBeat();
  };

  conn.onmessage=function(event){
    console.log(event.data);
    var data=JSON.parse(event.data);
    if(data.message_type===4&&JSON.parse(data.body).status==="ok"){
      conn.send(JSON.stringify(newMessage(1,0,"startGame","")))
      if(actor){
        actor.emit("incr","uid")
      }
    }
  };
  var reqID=0;
  var heartBeat=function(){
    if(actor){
      setInterval(function(){
        conn.ping(reqID+"");
        actor.emit("start","ping",reqID+"");
        reqID++;
      },100);
    }
  };

  conn.on("pong", function (data) {
    if(actor){
      actor.emit("end","ping",data+"");
    }
  });

  var newMessage=function(mType,id,route,body){
    return {
      message_type:mType,
      message_id:id,
      route:route,
      body:body
    };
  };
});