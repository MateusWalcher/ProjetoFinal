<template>
  <div class="login-page" style="background-color: rgb(80, 83, 80);">
    <div class="card" style="background-color: rgb(19, 19, 66);">
      <div class="card-content">
        <div class="form-group">
          <label for="username">Usuário:</label>
          <q-input v-model="username" filled dense outlined />
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <q-input v-model="password" type="password" filled dense outlined />
          <div class="space"></div>
        </div>
        <div class="form-group text-center">
          <q-btn class="login-button" @click="login">Login</q-btn>
        </div>
        <div class="form-group text-center">
          <div class="space-button"></div>
          <q-btn class="google-login-button" @click="loginWithGoogle">
            <img src="../assets/google.svg" alt="Google Logo">
            Logar com Google
          </q-btn>
        </div>
        <div class="form-group text-center">
          <div class="space-button"></div>
          <q-btn class="register-button" @click="showRegisterDialog">Register</q-btn>
        </div>
        <q-dialog v-model="registerDialog" persistent>
          <q-card>
            <q-card-section>
              <q-input v-model="registerEmail" filled dense outlined label="Email" />
              <q-input v-model="registerPassword" type="password" filled dense outlined label="Senha" :rules="[passwordRule]" @blur="registerPasswordTouched = true" />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn label="Cancelar" color="primary" flat dense @click="closeRegisterDialog" />
              <q-btn label="Confirmar" color="primary" dense @click="confirmRegister" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import auth from 'boot/firebase.js'
import { Notify } from "quasar";

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      registerDialog: false, // Variável para controlar a exibição do diálogo de registro
      registerEmail: '', // Variável para armazenar o email digitado no diálogo de registro
      registerPassword: '', // Variável para armazenar a senha digitada no diálogo de registro
      registerPasswordTouched: false,
    };
  },

  methods: {

    passwordRule(value) {
      const rules = [
        val => !!val || '',
        val => (val && val.length >= 6) || 'A senha deve ter no mínimo 6 caracteres'
      ];

      const errorMessages = {};

      rules.forEach((rule, index) => {
        const ruleResult = rule(value);
        if (typeof ruleResult === 'string') {
          if (this.registerPasswordTouched) {
            errorMessages[index] = ruleResult;
          }
        }
      });

      return errorMessages;
    },

    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.username, this.password);
        // O login foi bem-sucedido, você pode fazer algo com o `userCredential` aqui
        console.log('Login bem-sucedido:', userCredential.user);
        this.$router.push('/principal');
      } catch (error) {
        // Ocorreu um erro durante o login, você pode lidar com o erro aqui
        console.error('Erro durante o login:', error);
      }
    },

    loginWithGoogle() {
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
        .then((userCredential) => {
          // O login com o Google foi bem-sucedido, você pode fazer algo com o `userCredential` aqui
          console.log('Login com Google bem-sucedido:', userCredential.user);
          this.$router.push('/principal');
        })
        .catch((error) => {
          // Ocorreu um erro durante o login com o Google, você pode lidar com o erro aqui
          console.error('Erro durante o login com Google:', error);
        });
    },

    async register(email, password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // O registro foi bem-sucedido, você pode fazer algo com o `userCredential` aqui
        console.log('Registro bem-sucedido:', userCredential.user);
      } catch (error) {
        // Ocorreu um erro durante o registro, você pode lidar com o erro aqui
        console.error('Erro durante o registro:', error);
      }
    },

    showRegisterDialog() {
      this.registerDialog = true; // Abre o diálogo de registro
    },

    closeRegisterDialog() {
      this.registerDialog = false; // Fecha o diálogo de registro
    },

    async confirmRegister() {
      try {
        this.registerPasswordTouched = true;

        const validationResult = this.passwordRule(this.registerPassword);
        const isValid = Object.keys(validationResult).length === 0;

        if (isValid) {
          await this.register(this.registerEmail, this.registerPassword);
          Notify.create({
            message: 'Registro bem-sucedido!',
            color: 'positive',
            position: 'top',
            timeout: 2000
          });
          this.closeRegisterDialog();
        } else {
          const errorMessages = Object.values(validationResult);
          Notify.create({
            message: errorMessages.join('\n'),
            color: 'negative',
            position: 'top',
            timeout: 2000
          });
        }
      } catch (error) {
        console.error('Erro durante o registro:', error);
        Notify.create({
          message: 'Erro durante o registro!',
          color: 'negative',
          position: 'top',
          timeout: 2000
        });
      }
    }
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  width: 300px;
  padding: 20px;
  border-radius: 5px;
  color: white;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

.q-field {
  background-color: white;
  color: black;
}

.login-button,
.register-button,
.google-login-button {
  width: 75%;
  padding: 10px;
  border: none;
  border-radius: 20px;
  color: white;
  background-color: #333;
  cursor: pointer;
}

.text-center {
  text-align: center;
}

.google-login-button {
  margin-left: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-login-button img {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.space {
  height: 30px;
}

.space-button {
  height: 10px;
}

.q-btn:hover {
  cursor: pointer;
}
</style>
