"use client"

import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export function BackendStatus() {
  const { backendConnected, loading } = useAuth()

  if (loading) {
    return null
  }

  if (backendConnected) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Backend Server Not Running</strong>
          <br />
          The Flask backend server is not accessible at localhost:5000. Please start the backend server to use all
          features.
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="ml-4 bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}
