import { expect, test } from '@playwright/test';

test('homepage redirects to onboarding for new user', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/\/onboarding/);
});

test('onboarding flow shows role selection', async ({ page }) => {
	await page.goto('/onboarding');
	await expect(page.getByText('Choose your path')).toBeVisible();
	await expect(page.getByText('Front-End Developer')).toBeVisible();
	await expect(page.getByText('Svelte Specialist')).toBeVisible();
});

test('can navigate through onboarding steps', async ({ page }) => {
	await page.goto('/onboarding');

	// Step 1: Select role
	await page.getByText('Front-End Developer').click();
	await expect(page).toHaveURL(/\/onboarding\/goals/);

	// Step 2: Goals page should show name input
	await expect(page.getByText('What are your goals')).toBeVisible();
});
