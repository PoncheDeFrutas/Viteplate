import { useState } from 'react';
import {
    Button,
    Input,
    Label,
    Textarea,
    Checkbox,
    Switch,
    RadioGroup,
    RadioGroupItem,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui';

export function InputSection() {
    const [checked, setChecked] = useState(false);
    const [switchOn, setSwitchOn] = useState(false);
    const [radio, setRadio] = useState('option-1');

    return (
        <div className="space-y-12">
            {/* Buttons */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Button</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                    Multi-variant button primitive. 6 variants, 4 sizes, optional loading state.
                </p>

                <div className="space-y-6">
                    <div>
                        <p className="mb-3 text-xs font-medium text-muted-foreground uppercase">
                            Variants
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button variant="default">Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="link">Link</Button>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-xs font-medium text-muted-foreground uppercase">
                            Sizes
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon">+</Button>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-xs font-medium text-muted-foreground uppercase">
                            States
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button loading>Loading</Button>
                            <Button disabled>Disabled</Button>
                            <Button fullWidth>Full Width</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Input</h3>
                <div className="grid max-w-sm gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="input-default">Default</Label>
                        <Input id="input-default" placeholder="Type something..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="input-error" required>
                            With error
                        </Label>
                        <Input id="input-error" variant="error" placeholder="Invalid value" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="input-disabled">Disabled</Label>
                        <Input id="input-disabled" disabled placeholder="Cannot edit" />
                    </div>
                </div>
            </div>

            {/* Textarea */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Textarea</h3>
                <div className="grid max-w-sm gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="textarea-default">Default (vertical resize)</Label>
                        <Textarea id="textarea-default" placeholder="Write a message..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="textarea-error">Error state</Label>
                        <Textarea
                            id="textarea-error"
                            variant="error"
                            placeholder="Something went wrong"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="textarea-none">No resize</Label>
                        <Textarea id="textarea-none" resize="none" placeholder="Fixed size" />
                    </div>
                </div>
            </div>

            {/* Checkbox */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Checkbox</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="checkbox-demo"
                            checked={checked}
                            onCheckedChange={(v) => setChecked(v === true)}
                        />
                        <Label htmlFor="checkbox-demo">Accept terms and conditions</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="checkbox-indeterminate" indeterminate />
                        <Label htmlFor="checkbox-indeterminate">Indeterminate</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="checkbox-disabled" disabled />
                        <Label htmlFor="checkbox-disabled">Disabled</Label>
                    </div>
                </div>
            </div>

            {/* Switch */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Switch</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Switch
                            id="switch-default"
                            checked={switchOn}
                            onCheckedChange={setSwitchOn}
                        />
                        <Label htmlFor="switch-default">Default ({switchOn ? 'on' : 'off'})</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch id="switch-success" variant="success" defaultChecked />
                        <Label htmlFor="switch-success">Success variant</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch id="switch-sm" size="sm" />
                        <Label htmlFor="switch-sm">Small</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch id="switch-lg" size="lg" />
                        <Label htmlFor="switch-lg">Large</Label>
                    </div>
                </div>
            </div>

            {/* RadioGroup */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">RadioGroup</h3>
                <RadioGroup value={radio} onValueChange={setRadio}>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="option-1" id="radio-1" />
                        <Label htmlFor="radio-1">Option one</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="option-2" id="radio-2" />
                        <Label htmlFor="radio-2">Option two</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="option-3" id="radio-3" />
                        <Label htmlFor="radio-3">Option three</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Select */}
            <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">Select</h3>
                <div className="max-w-sm space-y-2">
                    <Label>Choose a framework</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a framework" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="vue">Vue</SelectItem>
                            <SelectItem value="svelte">Svelte</SelectItem>
                            <SelectItem value="angular">Angular</SelectItem>
                            <SelectItem value="solid">SolidJS</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
