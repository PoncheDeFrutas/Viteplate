import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Pagination,
    PaginationButton,
    PaginationContent,
    PaginationEllipsis,
    PaginationFirst,
    PaginationItem,
    PaginationLast,
    PaginationNext,
    PaginationPrevious,
    StyledLink,
} from '@shared/ui';

export function NavigationSection() {
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
