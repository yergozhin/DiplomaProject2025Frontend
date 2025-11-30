<template>
  <div class="landing-page">
    <header class="landing-header">
      <nav class="landing-nav">
        <div class="nav-brand">GladiatorGrid</div>
        <div class="nav-links">
          <router-link
            v-if="!isAuthenticated"
            to="/login"
            class="nav-link"
          >
            Login
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="nav-link"
          >
            Register
          </router-link>
          <router-link
            v-if="isAuthenticated"
            :to="dashboardRoute"
            class="nav-link"
          >
            {{ dashboardButtonText }}
          </router-link>
          <button
            v-if="isAuthenticated"
            @click="handleLogout"
            class="nav-link logout-btn"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>

    <main class="landing-main">
      <section class="hero-section">
        <h1 class="hero-title">title</h1>
        <p class="hero-description">description</p>
        <div class="hero-actions">
          <router-link v-if="!isAuthenticated" to="/register" class="btn btn-primary">cta button</router-link>
          <router-link v-if="isAuthenticated" :to="dashboardRoute" class="btn btn-primary">{{ dashboardButtonText }}</router-link>
        </div>
      </section>

      <section class="features-section">
        <h2 class="section-title">features title</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3 class="feature-title">feature title</h3>
            <p class="feature-description">feature description</p>
          </div>
          <div class="feature-card">
            <h3 class="feature-title">feature title</h3>
            <p class="feature-description">feature description</p>
          </div>
          <div class="feature-card">
            <h3 class="feature-title">feature title</h3>
            <p class="feature-description">feature description</p>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2 class="section-title">about title</h2>
        <p class="about-description">about description</p>
      </section>

      <section v-if="!isAuthenticated" class="cta-section">
        <h2 class="section-title">cta title</h2>
        <p class="cta-description">cta description</p>
        <router-link to="/register" class="btn btn-primary">cta button</router-link>
      </section>
    </main>

    <footer class="landing-footer">
      <p class="footer-text">footer text</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const dashboardRoute = computed(() => authStore.getDashboardRoute());
const userRole = computed(() => authStore.userRole);

const dashboardButtonText = computed(() => {
  if (!userRole.value) return 'Go to Dashboard';
  if (userRole.value === 'fighter') return 'Go to Fighter Page';
  if (userRole.value === 'plo') return 'Go to PLO Page';
  if (userRole.value === 'admin') return 'Go to Admin Page';
  if (userRole.value === 'spectator') return 'Go to Spectator Page';
  return 'Go to Dashboard';
});

function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.landing-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: white;
}

.landing-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: #f5f5f5;
}

.logout-btn {
  background-color: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: #dc3545;
  color: white;
}

.landing-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-image: url('@/assets/landing.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.hero-description {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #333;
  color: white;
}

.btn-primary:hover {
  background-color: #555;
}

.features-section {
  padding: 4rem 2rem;
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #1a1a1a;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.2s ease;
}

.feature-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-description {
  color: #666;
}

.about-section {
  padding: 4rem 2rem;
  text-align: center;
}

.about-description {
  font-size: 1.1rem;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
}

.cta-section {
  padding: 4rem 2rem;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 2rem 0;
}

.cta-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.landing-footer {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  margin-top: 4rem;
  background-color: white;
}

.footer-text {
  color: #666;
}
</style>

