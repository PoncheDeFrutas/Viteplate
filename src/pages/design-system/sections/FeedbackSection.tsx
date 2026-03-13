import { useState } from 'react';
import {
    Alert,
    EmptyState,
    ErrorMessage,
    Spinner,
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    Button,
} from '@shared/ui';
import { Inbox } from 'lucide-react';

export function FeedbackSection() {
    const [showToast, setShowToast] = useState(false);

    return (
        <div className="space-y-12">
            {/* Alert */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Alert</h3>
                <div className="max-w-lg space-y-4">
                    <Alert title="Default alert">
                        This is a default alert with a title and description.
                    </Alert>
                    <Alert variant="info" title="Information">
                        Your session will expire in 5 minutes.
                    </Alert>
                    <Alert variant="success" title="Success">
                        Your changes have been saved successfully.
                    </Alert>
                    <Alert variant="warning" title="Warning">
                        This action cannot be easily undone.
                    </Alert>
                    <Alert variant="destructive" title="Error">
                        Failed to save changes. Please try again.
                    </Alert>
                    <Alert variant="info" title="Dismissible" dismissible>
                        Click the X button to dismiss this alert.
                    </Alert>
                </div>
            </div>

            {/* EmptyState */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">EmptyState</h3>
                <EmptyState
                    icon={<Inbox className="h-6 w-6" />}
                    title="No messages"
                    description="You have no unread messages at this time."
                    action={
                        <Button size="sm" variant="outline">
                            Refresh
                        </Button>
                    }
                />
            </div>

            {/* ErrorMessage */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">ErrorMessage</h3>
                <div className="max-w-sm">
                    <ErrorMessage message="This field is required." />
                </div>
            </div>

            {/* Spinner */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Spinner</h3>
                <div className="flex items-center gap-4">
                    <Spinner size="xs" />
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                </div>
            </div>

            {/* Toast */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Toast</h3>
                <ToastProvider>
                    <Button variant="outline" onClick={() => setShowToast(true)}>
                        Show Toast
                    </Button>
                    <Toast
                        open={showToast}
                        onOpenChange={setShowToast}
                        variant="success"
                        duration={4000}
                    >
                        <div className="grid gap-1">
                            <ToastTitle>Changes saved</ToastTitle>
                            <ToastDescription>
                                Your profile has been updated successfully.
                            </ToastDescription>
                        </div>
                        <ToastClose />
                    </Toast>
                    <ToastViewport />
                </ToastProvider>
            </div>
        </div>
    );
}
