export default () => {
  return {
    route: window.location.hash || '#/',
    isLoggedIn: false, // Menandakan status login
    username: '',
    password: '',

    changeRoute(newRoute) {
      if (newRoute === '#/chat' && !this.isLoggedIn) {
        this.route = '#/';
        alert('Please login to access the chat room.');
      } else {
        this.route = newRoute;
        window.location.hash = newRoute;
      }
    },

    async login() {
      // Simulasi request ke server untuk mendapatkan JWT
      const response = await fetch('https://your-auth-api.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: this.username, password: this.password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Simpan token JWT setelah login berhasil
        localStorage.setItem('token', data.token);
        this.isLoggedIn = true;
        alert('Login successful!');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    }
  }

}
