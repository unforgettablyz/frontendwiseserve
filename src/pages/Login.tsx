import { type Dispatch, type SetStateAction } from "react";
import { AuthLayout } from "../components/auth/AuthLayout";

type Theme = "light" | "dark";
type Language = "en" | "bm";

interface LoginProps {
  onLogin: (companyName: string, rememberMe?: boolean) => void;
  theme?: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  language?: Language;
  setLanguage?: Dispatch<SetStateAction<Language>>;
}

export const Login = ({ onLogin, theme = "light" }: LoginProps) => (
  <AuthLayout onLogin={onLogin} theme={theme} />
);

export default Login;
