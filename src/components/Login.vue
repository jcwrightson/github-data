<template>
		
	<div class="loginDialogue">
		<form id="login">
			<input type="text" v-model="email" />
			<input type="password" v-model="password" />
			<button v-on:click="handleLogin()">Login</button>
		</form>
	</div>
	
</template>

<script>

export default {
	name: 'login',
	data(){
		return {
			email: null,
			password: null
		}
	},
	mounted(){
		
		const loginForm = document.querySelector('form#login')

		if(loginForm){
			loginForm.addEventListener("submit", (e)=>{
				e.preventDefault()
			})
		}
	},

	methods: {
		handleLogin: function(){
			console.log(this.email)
		}
	}
}
</script>
