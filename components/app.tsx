// components/app.tsx
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import ApiCallComponent from "@/components/api-call-component"

export default function App() {
  return (
    <ToastProvider>
      <ToastViewport />
      <ApiCallComponent />
    </ToastProvider>
  )
}
