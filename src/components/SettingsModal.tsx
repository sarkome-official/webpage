import * as React from "react"
import { useTranslation } from "react-i18next"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
    Settings, 
    Bell, 
    Palette, 
    Lock, 
    User,
    Globe,
} from "lucide-react"

interface SettingsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
    const { t, i18n } = useTranslation()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Settings className="size-5" />
                        <DialogTitle>{t('sidebar.settings')}</DialogTitle>
                    </div>
                    <DialogDescription>
                        Manage your preferences and account settings
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <Settings className="size-4" />
                            <span className="hidden sm:inline">General</span>
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="flex items-center gap-2">
                            <Palette className="size-4" />
                            <span className="hidden sm:inline">Appearance</span>
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <span className="hidden sm:inline">Privacy</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* General Tab */}
                    <TabsContent value="general" className="space-y-6 mt-6">
                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Globe className="size-4" />
                                Language
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                                    <div>
                                        <p className="text-sm font-medium">Idioma</p>
                                        <p className="text-xs text-muted-foreground">Automatic detection based on your browser settings</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={i18n.language === 'en' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => i18n.changeLanguage('en')}
                                            className="text-xs"
                                        >
                                            English
                                        </Button>
                                        <Button
                                            variant={i18n.language === 'es' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => i18n.changeLanguage('es')}
                                            className="text-xs"
                                        >
                                            Español
                                        </Button>
                                        <Button
                                            variant={i18n.language === 'pt' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => i18n.changeLanguage('pt')}
                                            className="text-xs"
                                        >
                                            Português
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h3 className="text-sm font-semibold mb-3">Preferences</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                                    <div>
                                        <p className="text-sm font-medium">Auto-save</p>
                                        <p className="text-xs text-muted-foreground">Automatically save your work</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-6 mt-6">
                        <div>
                            <h3 className="text-sm font-semibold mb-3">Theme</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                                    <div>
                                        <p className="text-sm font-medium">Dark Mode</p>
                                        <p className="text-xs text-muted-foreground">Currently active</p>
                                    </div>
                                    <div className="size-4 rounded-full bg-primary" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h3 className="text-sm font-semibold mb-3">Accent Color</h3>
                            <div className="flex gap-3">
                                <button className="size-8 rounded-full bg-violet-500/80 ring-2 ring-violet-400/50" title="Purple (Default)" />
                                <button className="size-8 rounded-full bg-blue-500/80 hover:ring-2 hover:ring-blue-400/50 transition-all cursor-pointer" title="Blue" />
                                <button className="size-8 rounded-full bg-cyan-500/80 hover:ring-2 hover:ring-cyan-400/50 transition-all cursor-pointer" title="Cyan" />
                                <button className="size-8 rounded-full bg-emerald-500/80 hover:ring-2 hover:ring-emerald-400/50 transition-all cursor-pointer" title="Green" />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Privacy Tab */}
                    <TabsContent value="privacy" className="space-y-6 mt-6">
                        <div>
                            <h3 className="text-sm font-semibold mb-3">Data & Privacy</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                                    <div>
                                        <p className="text-sm font-medium">Analytics</p>
                                        <p className="text-xs text-muted-foreground">Help us improve by sharing usage data</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                                    <div>
                                        <p className="text-sm font-medium">Marketing Emails</p>
                                        <p className="text-xs text-muted-foreground">Receive updates about new features</p>
                                    </div>
                                    <input type="checkbox" className="w-4 h-4 rounded" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h3 className="text-sm font-semibold mb-3">Account</h3>
                            <Button variant="destructive" className="w-full">
                                Delete Account
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
