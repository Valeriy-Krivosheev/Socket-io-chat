<template>
  <div class="container">
    <div class="col">
      <div class="col-md-12 mb-3">
        <h3 class="mb-3">Chat Messages</h3>
        <ul class="list-group"  ref="chatContainer">
          <li class="list-group-item" v-for="msg in messages" :key="msg.id" :class="{'admin':msg.name === 'Admin','self':msg.name === 'You'}">
            <strong>{{ msg.name }}:</strong> {{ msg.message }}
          </li>
        </ul>
      </div>
      <div class="col-md-12">
        <h2 class="mb-3">Chat</h2>
        <form @submit.prevent="sendMessage">
          <div class="mb-3">
            <textarea ref="textarea" placeholder="Send a message" class="form-control" v-model="message" @keyup.enter="sendMessage"></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-100">Send</button>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
export default {
  data(){
    return{
      socket: {},
      name: '',
      message: '',
      messages: []
    }
  },
  methods: {
    sendMessage() {
      if (this.name && this.message.trim()) {
        this.socket.emit('send-message',{
          id: Date.now(),
          name: this.name,
          message: this.message,
        })
        this.message = '';
      }
      else {
        this.$refs.textarea.focus()
      }
    },
    scrollToBottom() {
      const chatContainer = this.$refs.chatContainer
      chatContainer.scrollTop = chatContainer?.scrollHeight;
    },
  },
  created() {
    this.name =  prompt('Привет, напиши свой ник для чата').trim() || 'Anonimus'
    this.socket = io("http://localhost:8080");
    this.socket.emit('set-name',this.name)
  },
  mounted() {
    this.socket.on("receive-message", (msg) => {
      this.messages.push(msg)
      this.$nextTick(() => {
        this.scrollToBottom();
        this.messages.map(item=>{
          if(item.name === this.name){
            item.name = 'You'
            return item
          }
        })
      });
    });

  },
  beforeDestroy() {
    this.socket.emit('user-left',this.name)
  }
};
</script>

<style>
.col{
  width: 700px;
}

textarea{
  resize: none;
}
.list-group{
  height: 240px;
  overflow-y: auto;
}
.list-group-item{
  background: burlywood;
}
.list-group-item.self{
  background: aliceblue;
}
.list-group-item.admin{
  background: antiquewhite;
}
@media(max-width: 768px){
  form{
    margin-bottom: 50px;
  }
}
</style>



