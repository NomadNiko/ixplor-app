import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";

const ThemeSwitchButton = () => {
  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.dataset.theme;
    const newTheme = currentTheme === "purple" ? "darker" : "purple";
    root.dataset.theme = newTheme;
  };

  // Get current theme to determine which icon to show
  const currentTheme = typeof document !== 'undefined' 
    ? document.documentElement.dataset.theme 
    : 'purple';

  return (
    <IconButton
      disableRipple
      onClick={toggleTheme}
      color="inherit"
    >
      {currentTheme === "darker" ? (
        <Brightness7Icon sx={{ width: 35, height: 35 }} />
      ) : (
        <Brightness4Icon sx={{ width: 35, height: 35 }} />
      )}
    </IconButton>
  );
};

export default ThemeSwitchButton;