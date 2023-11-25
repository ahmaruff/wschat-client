var app = {}
app.serverUrl = '127.0.0.1:5000';
app.ws = undefined;
app.chatContainer = undefined;
app.sessionContainer = undefined;
app.user = {
  id : '',
  name : 'anonymous', 
},
app.session_id = '';

app.generateNewSession = async function(tp) {
  if(tp == ''){
    tp = 'PRIVATE'
  }

  const resp = await fetch("http://"+app.serverUrl+"/session/create?type="+tp);
  let sessiondata = await resp.json();
  console.log(sessiondata);

  await this.getSession();
  await this.showSessionList();
};

app.generateNewUserAccount = async function() {
  let nm = localStorage.getItem('user_name')
  if(nm == null || nm == '') {
    nm = "anonymous"
  }
  const resp = await fetch("http://"+app.serverUrl+"/user/create", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json',
    },
    body : JSON.stringify({
      name : nm
    })
  })

  let userdata = await resp.json();
  console.log(userdata);
  localStorage.setItem('user_id', userdata.id);
  app.user.id = userdata.id;
  app.user.name = userdata.name;
  console.log(localStorage.getItem('user_id'));
}

app.print = function (user_id, name, message) {
    u_id = localStorage.getItem('user_id');
    var el = document.createElement("section");
    
    if (u_id == user_id) {
      el.classList.add("bg-emerald-700", 'w-fit', "p-2","rounded-md", "ml-auto", "mb-2", "text-white");
    }
    else {
      el.classList.add("bg-slate-600", 'w-fit', "p-2","rounded-md", "mr-auto", "mb-2", "text-white");
    }

    var sender = document.createElement('p');
    sender.innerHTML = name;
    sender.classList.add('text-xs', 'text-right');

    var txt = document.createElement("p");
    txt.innerHTML = message
    el.append(txt);
    el.append(sender);
    app.chatContainer.append(el)
}

app.closeSession = function(){
  app.ws.Close();
  console.log("close");
}

app.getSession = async function(){
  localStorage.removeItem('sessionList');
  const resp = await fetch("http://"+app.serverUrl+"/session");
  let sessiondata = await resp.json();
  // console.log(sessiondata);
  localStorage.setItem('sessionList', JSON.stringify(sessiondata));
  // console.log(sessiondata);
}

app.showSessionList = function() {
  let sl = localStorage.getItem('sessionList');
  console.log(sl);
  let sessionList = JSON.parse(sl);
  console.log(sessionList);

  var sessionScreen = document.getElementById('session-list')
  
  if(sessionScreen.childElementCount != 0){
    sessionScreen.replaceChildren();
  }
  

  if (sessionList != null) {
    console.log(sessionList);
    let k = Object.keys(sessionList);
    k.forEach((key, index) => {
      let session = sessionList[key];

      var listEl = document.createElement('section');
      listEl.classList.add("w-full", "p-2", "mb-2", "border-b-2", "rounded-md", "bg-slate-700", "border-slate-800");
    
      var idEL = document.createElement("h2");
      idEL.classList.add("truncate","font-bold", "text-purple-400");
      idEL.innerHTML = session.id
      var btnEl = document.createElement("button");
      btnEl.classList.add("px-4", "py-2", "bg-slate-500", "hover:bg-slate-600", "text-white", "rounded-md", "mt-2", "w-full");
      btnEl.setAttribute("type","submit");
      btnEl.setAttribute("onclick","app.websoc('"+session.id+"')");
      btnEl.innerHTML = "Join room"


      listEl.append(idEL);
      listEl.append(btnEl);
      sessionScreen.append(listEl);
    })
  }
  else {
    var el = document.createElement("h1");
    el.classList.add("text-lg", "font-bold", "text-center", "text-slate-900");
    el.innerHTML = "There is no room chat, please create new room";

    sessionScreen.append(el);
  }
}

app.doSendMessage = function () {
    var messageRaw = document.getElementById('sendmsg').value;
    app.ws.send(JSON.stringify({
        sender_id : app.user.id,
        message: messageRaw
    }));

    var message = messageRaw

    let u_id = localStorage.getItem('user_id');
    let u_name = localStorage.getItem('user_name');
    this.print(u_id ,u_name, message)
    
    document.getElementById('sendmsg').value = ''
}
app.init = async function () {
    localStorage.clear();
    if (!(window.WebSocket)) {
        alert('Your browser does not support WebSocket')
        return
    }
    app.showSessionList();

    nm = prompt("Enter Your Name Please: ") || "anonymous"
    localStorage.setItem('user_name', nm);
    app.generateNewUserAccount();

    // let s_id = localStorage.getItem('session_id');
    let u_id = localStorage.getItem('user_id');
    let u_name = localStorage.getItem('user_name');

    if (u_name == null || u_name == '' || u_id == null || u_id == '') {
      nm = prompt("Enter Your Name Please: ") || "anonymous"
      localStorage.setItem('user_name', nm);
      app.generateNewUserAccount();
    }

    document.getElementById('displayname').innerHTML = u_name

    // generate user
    // if (u_id == null || u_id == ''){
    //   await app.generateNewUserAccount();
    // }

    // 
    // if (s_id == null || s_id == ''){
    //   await app.generateNewSession("PRIVATE")
    // }
    app.chatContainer = document.getElementById("chat-screen")

    // await app.websoc()
}

app.websoc = function(sessionId) {
  // close existing connection
  if (app.ws != undefined) {
    app.ws.close();
  }
  
  // let s_id = localStorage.getItem('session_id');
  let u_id = localStorage.getItem('user_id');
  let u_name = localStorage.getItem('user_name');
  
  app.ws = new WebSocket("ws://"+app.serverUrl+"/ws?session_id=" + sessionId + "&user_id="+u_id)

  app.ws.onopen = function() {
      var message = 'I am connected'
      app.print(u_id, u_name, message)
  }

  app.ws.onmessage = function (event) {
    var res = JSON.parse(event.data)

    var mes = res.message
    var user_id = res.sender_id;
    var user_name = res.sender_name;

      app.print(user_id, user_name, mes)
  }

  app.ws.onclose = function () {
      var message = 'me disconnected'
      app.print(u_id, u_name, message)
  }
}

// export default app;
window.onload = app.init

