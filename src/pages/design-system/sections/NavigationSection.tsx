import { useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    CommandPalette,
    CommandPaletteEmpty,
    CommandPaletteGroup,
    CommandPaletteItem,
    Pagination,
    PaginationButton,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationNext,
    PaginationPrevious,
    Stepper,
    StyledLink,
    Button,
    Kbd,
} from '@shared/ui';
import { Calculator, Calendar, Settings, Smile, User } from 'lucide-react';

export function NavigationSection() {
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    return (
        <div className="space-y-12">
            {/* Breadcrumb */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Breadcrumb</h3>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/about">About</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Design System</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Stepper */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Stepper</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                    Multi-step progress indicator with animated transitions.
                </p>
                <div className="max-w-lg space-y-6">
                    <Stepper
                        activeStep={activeStep}
                        steps={[
                            { label: 'Account', description: 'Create your account' },
                            { label: 'Profile', description: 'Set up your profile' },
                            { label: 'Review', description: 'Review and confirm' },
                        ]}
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                            disabled={activeStep === 0}
                        >
                            Back
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setActiveStep((s) => Math.min(3, s + 1))}
                            disabled={activeStep > 2}
                        >
                            {activeStep >= 2 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Command Palette */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Command Palette</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                    Full-screen command palette overlay built on cmdk. Press the button or{' '}
                    <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> (in a real app).
                </p>
                <Button variant="outline" onClick={() => setPaletteOpen(true)}>
                    Open Command Palette
                </Button>
                <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen}>
                    <CommandPaletteEmpty>No results found.</CommandPaletteEmpty>
                    <CommandPaletteGroup heading="Suggestions">
                        <CommandPaletteItem>
                            <Calendar className="mr-2 h-4 w-4" /> Calendar
                        </CommandPaletteItem>
                        <CommandPaletteItem>
                            <Smile className="mr-2 h-4 w-4" /> Search Emoji
                        </CommandPaletteItem>
                        <CommandPaletteItem>
                            <Calculator className="mr-2 h-4 w-4" /> Calculator
                        </CommandPaletteItem>
                    </CommandPaletteGroup>
                    <CommandPaletteGroup heading="Settings">
                        <CommandPaletteItem>
                            <User className="mr-2 h-4 w-4" /> Profile
                        </CommandPaletteItem>
                        <CommandPaletteItem>
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </CommandPaletteItem>
                    </CommandPaletteGroup>
                </CommandPalette>
            </div>

            {/* Pagination */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Pagination</h3>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationFirst />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationPrevious />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationButton>1</PaginationButton>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationButton isActive>2</PaginationButton>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationButton>3</PaginationButton>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationButton>10</PaginationButton>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLast />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* StyledLink */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">StyledLink</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <StyledLink href="#">Default link</StyledLink>
                        <StyledLink href="#" variant="muted">
                            Muted link
                        </StyledLink>
                        <StyledLink href="#" variant="nav">
                            Nav link
                        </StyledLink>
                    </div>
                    <div className="flex items-center gap-4">
                        <StyledLink href="#" size="sm">
                            Small
                        </StyledLink>
                        <StyledLink href="#" size="md">
                            Medium
                        </StyledLink>
                        <StyledLink href="#" size="lg">
                            Large
                        </StyledLink>
                    </div>
                    <div>
                        <StyledLink href="https://github.com" external>
                            External link (opens in new tab)
                        </StyledLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
