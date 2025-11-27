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
            Dashboard
          </router-link>
        </div>
      </nav>
    </header>

    <main class="landing-main">
      <section class="hero-section">
        <h1 class="hero-title">title</h1>
        <p class="hero-description">description</p>
        <div v-if="!isAuthenticated" class="hero-actions">
          <router-link to="/register" class="btn btn-primary">cta button</router-link>
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
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const dashboardRoute = computed(() => authStore.getDashboardRoute());
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
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #f5f5f5;
}

.landing-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.2rem;
  color: #666;
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
  transition: background-color 0.2s;
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
  color: #666;
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
}

.footer-text {
  color: #666;
}
</style>

