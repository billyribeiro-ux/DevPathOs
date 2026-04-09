class AppState {
  sidebarOpen = $state(true);
  commandPaletteOpen = $state(false);

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleCommandPalette() {
    this.commandPaletteOpen = !this.commandPaletteOpen;
  }
}

export const appState = new AppState();
