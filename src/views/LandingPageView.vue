<template>
  <div class="landing-page">
    <header class="landing-header">
      <nav class="landing-nav">
        <router-link to="/" class="nav-brand">
          <img src="@/assets/logo.jpg" alt="GladiatorGrid" class="logo-img" />
          <span class="brand-text">GladiatorGrid</span>
        </router-link>
        <div class="nav-links">
          <router-link
            v-if="!isAuthenticated"
            to="/login"
            class="nav-link nav-link-login"
          >
            Login
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="nav-link nav-link-register"
          >
            Register
          </router-link>
          <router-link
            v-if="isAuthenticated"
            :to="dashboardRoute"
            class="nav-link nav-link-dashboard"
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
      <div class="landing-content">
        <section class="hero-section">
          <h1 class="hero-title">Fight. Win. Repeat.</h1>
          <p class="hero-description">The platform that connects fighters, promotion leagues, and fans. Organize fights faster, find opponents easier, and grow your career without the hassle. Join thousands who are already transforming how fights are made.</p>
          <div class="hero-actions">
            <router-link v-if="!isAuthenticated" to="/register" class="btn btn-primary">Get Started</router-link>
            <router-link v-if="isAuthenticated" :to="dashboardRoute" class="btn btn-primary">{{ dashboardButtonText }}</router-link>
          </div>
        </section>

        <section class="features-section">
          <h2 class="section-title">Why Choose GladiatorGrid?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <h3 class="feature-title">For Fighters</h3>
              <p class="feature-description">Take control of your fighting career! No more waiting for managers or struggling to find opponents. Search and connect with fighters, send fight requests directly, and choose from multiple promotion league offers. Organize your fights independently and get more matches than ever before. Your career, your way.</p>
            </div>
            <div class="feature-card">
              <h3 class="feature-title">For Promotion Leagues</h3>
              <p class="feature-description">Streamline your event organization and maximize efficiency. Create events with time slots, instantly view all available fights, and send offers directly to fighters. Manage more fights with less effort and reduce your coordination overhead. Focus on what matters most - delivering great events.</p>
            </div>
            <div class="feature-card">
              <h3 class="feature-title">For Spectators</h3>
              <p class="feature-description">Discover the best fights and events in one place! Browse published events, view scheduled fights, and stay updated with the latest matchups. Get access to comprehensive fight information and never miss an exciting event. Your gateway to the fighting world.</p>
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2 class="section-title">About GladiatorGrid</h2>
          <p class="about-description">GladiatorGrid is a platform designed to solve the challenges fighters and promotion leagues face in organizing fights. We connect fighters directly with promotion leagues, eliminating the need for extensive management teams and reducing coordination overhead. Whether you're a fighter looking for your next match or a promotion league organizing events, GladiatorGrid makes the process simple and efficient.</p>
        </section>

        <section v-if="!isAuthenticated" class="cta-section">
          <h2 class="section-title">Ready to Get Started?</h2>
          <p class="cta-description">Join GladiatorGrid today and start organizing fights more efficiently. Register as a fighter, promotion league owner, or spectator to begin.</p>
          <router-link to="/register" class="btn btn-primary">Create Account</router-link>
        </section>
      </div>
    </main>

    <footer class="landing-footer">
      <p class="footer-text">© 2025 GladiatorGrid. All rights reserved.</p>
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover {
  background-color: #f5f5f5;
}

.nav-link-login {
  border: 1px solid #e0e0e0;
  color: #333;
}

.nav-link-login:hover {
  background-color: #f9f9f9;
  border-color: #d0d0d0;
}

.nav-link-register {
  background-color: #333;
  color: white;
  border: 1px solid #333;
}

.nav-link-register:hover {
  background-color: #555;
  border-color: #555;
}

.nav-link-dashboard {
  background-color: #333;
  color: white;
  border: 1px solid #333;
}

.nav-link-dashboard:hover {
  background-color: #555;
  border-color: #555;
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
  background-image: url('@/assets/landing.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.landing-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 0;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.hero-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
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
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
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
  color: rgba(255, 255, 255, 0.95);
  max-width: 800px;
  margin: 0 auto;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.cta-section {
  padding: 4rem 2rem;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 2rem 0;
}

.cta-section .section-title {
  color: #1a1a1a;
  text-shadow: none;
}

.cta-description {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 2rem;
}

.landing-footer {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  margin-top: 0;
  background-color: white;
}

.footer-text {
  color: #666;
}
</style>

