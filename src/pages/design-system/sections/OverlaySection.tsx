import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Button,
    Input,
    Label,
} from '@shared/ui';
import { Copy, LogOut, Pen, Settings, Trash, User } from 'lucide-react';

export function OverlaySection() {
    const [drawerSide, setDrawerSide] = useState<'left' | 'right'>('right');

    return (
        <div className="space-y-12">
            {/* Dialog */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Dialog</h3>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile. Click save when you are done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="John Doe" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue="john@example.com" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* AlertDialog */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">AlertDialog</h3>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove all data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* HoverCard */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">HoverCard</h3>
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button variant="link" className="p-0 text-base">
                            @viteplate
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Viteplate</h4>
                            <p className="text-sm text-muted-foreground">
                                Scalable React 19 starter template with Feature-Sliced Design, 50+
                                UI components, and full auth system.
                            </p>
                            <div className="text-xs text-muted-foreground">Joined January 2026</div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>

            {/* ContextMenu */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">ContextMenu</h3>
                <p className="mb-4 text-sm text-muted-foreground">Right-click on the area below.</p>
                <ContextMenu>
                    <ContextMenuTrigger>
                        <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground">
                            Right-click here
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-56">
                        <ContextMenuItem>
                            <Pen className="mr-2 h-4 w-4" />
                            Edit
                            <ContextMenuShortcut>Ctrl+E</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                            <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                            <ContextMenuShortcut>Del</ContextMenuShortcut>
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            </div>

            {/* Drawer */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Drawer</h3>
                <div className="flex gap-3">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" onClick={() => setDrawerSide('left')}>
                                Open Left Drawer
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent side={drawerSide === 'left' ? 'left' : 'right'}>
                            <DrawerHeader>
                                <DrawerTitle>Navigation</DrawerTitle>
                                <DrawerDescription>
                                    This is a drawer panel that slides in from the left.
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4">
                                <p className="text-sm text-muted-foreground">
                                    Drawer content goes here.
                                </p>
                            </div>
                        </DrawerContent>
                    </Drawer>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" onClick={() => setDrawerSide('right')}>
                                Open Right Drawer
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent side={drawerSide === 'right' ? 'right' : 'left'}>
                            <DrawerHeader>
                                <DrawerTitle>Settings</DrawerTitle>
                                <DrawerDescription>
                                    This is a drawer panel that slides in from the right.
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4">
                                <p className="text-sm text-muted-foreground">
                                    Settings content goes here.
                                </p>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>

            {/* Dropdown Menu */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Dropdown Menu</h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Open Menu</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                                <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                                <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                            <DropdownMenuShortcut>Ctrl+Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Popover */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Popover</h3>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Open Popover</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Dimensions</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set the dimensions for the layer.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="popover-width">Width</Label>
                                    <Input
                                        id="popover-width"
                                        defaultValue="100%"
                                        className="col-span-2"
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="popover-height">Height</Label>
                                    <Input
                                        id="popover-height"
                                        defaultValue="auto"
                                        className="col-span-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
