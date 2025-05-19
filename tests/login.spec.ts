// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the login form', async ({ page }) => {
    // Abrir el modal de inicio de sesión
    await page.click('button#btn-login');
    // Esperar a que el modal de inicio de sesión sea visible
    const loginModal = page.locator('#loginForm');
    await expect(loginModal).toBeVisible();
    // Verificar que el formulario de inicio de sesión esté visible
    const loginForm = page.locator('form#loginForm');
    await expect(loginForm).toBeVisible();
  });

  test('should show an error message for invalid credentials', async ({ page }) => {
    await page.fill('input[name="username"]', 'invalidUser');
    await page.fill('input[name="password"]', 'invalidPass');
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toHaveText('Invalid username or password');
  });
});