import { useState } from 'react';
import {
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
    Popover,
    PopoverContent,
    PopoverTrigger,
    Button,
    Input,
    Label,
} from '@shared/ui';
import { LogOut, Settings, User } from 'lucide-react';

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
