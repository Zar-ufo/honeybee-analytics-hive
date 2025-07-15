
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Building, Bell, Shield, CreditCard, Mail } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">{t('settings.general')}</TabsTrigger>
          <TabsTrigger value="company">{t('settings.company')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.security')}</TabsTrigger>
          <TabsTrigger value="billing">{t('settings.billing')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('settings.integrations')}</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('settings.profileInformation')}
                </CardTitle>
                <CardDescription>{t('settings.updatePersonalDetails')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t('settings.firstName')}</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('settings.lastName')}</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">{t('settings.emailAddress')}</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">{t('settings.phoneNumber')}</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="timezone">{t('settings.timezone')}</Label>
                  <Select defaultValue="utc-5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>{t('settings.saveChanges')}</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('settings.preferences')}</CardTitle>
                <CardDescription>{t('settings.customizeExperience')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.darkMode')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.toggleDarkMode')}</p>
                  </div>
                  <Switch 
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('settings.autoSave')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.autoSaveChanges')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div>
                  <Label htmlFor="language">{t('settings.language')}</Label>
                  <Select value={i18n.language} onValueChange={changeLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t('languages.english')}</SelectItem>
                      <SelectItem value="bn">{t('languages.bangla')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {t('settings.companyInformation')}
              </CardTitle>
              <CardDescription>{t('settings.manageCompanyDetails')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">{t('settings.companyName')}</Label>
                <Input id="companyName" defaultValue="HoneyBEE Enterprises" />
              </div>
              <div>
                <Label htmlFor="taxId">{t('settings.taxId')}</Label>
                <Input id="taxId" defaultValue="12-3456789" />
              </div>
              <div>
                <Label htmlFor="address">{t('settings.businessAddress')}</Label>
                <Textarea 
                  id="address" 
                  defaultValue="123 Business Ave, Suite 100&#10;City, State 12345&#10;United States"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">{t('settings.industry')}</Label>
                  <Select defaultValue="food">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employees">{t('settings.numberOfEmployees')}</Label>
                  <Select defaultValue="1-10">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="200+">200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="website">{t('settings.website')}</Label>
                <Input id="website" defaultValue="https://honeybee.example.com" />
              </div>
              <Button>{t('settings.updateCompanyInfo')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Orders</Label>
                      <p className="text-sm text-muted-foreground">When you receive a new order</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Confirmations</Label>
                      <p className="text-sm text-muted-foreground">When payments are processed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">When inventory is running low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Weekly business summaries</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Real-time Updates</Label>
                      <p className="text-sm text-muted-foreground">Instant notifications for important events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">Product updates and news</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Password & Authentication
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">Secure your account with two-factor authentication</p>
                  </div>
                  <Badge variant="outline">Not Enabled</Badge>
                </div>
                <Button variant="outline">Set Up 2FA</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Plan
                </CardTitle>
                <CardDescription>Manage your HoneyBEE subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Professional Plan</h4>
                    <p className="text-sm text-muted-foreground">$49/month • Billed monthly</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-4 border rounded-lg">
                    <h5 className="font-medium">Users</h5>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">of 10 used</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h5 className="font-medium">Storage</h5>
                    <p className="text-2xl font-bold">15GB</p>
                    <p className="text-sm text-muted-foreground">of 100GB used</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h5 className="font-medium">API Calls</h5>
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-sm text-muted-foreground">of 10K used</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>Upgrade Plan</Button>
                  <Button variant="outline">View All Plans</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge>Primary</Badge>
                </div>
                <Button variant="outline">Add Payment Method</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Third-party Integrations
              </CardTitle>
              <CardDescription>Connect HoneyBEE with your favorite tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "QuickBooks", description: "Sync accounting data", status: "connected" },
                { name: "Stripe", description: "Payment processing", status: "connected" },
                { name: "Mailchimp", description: "Email marketing", status: "available" },
                { name: "Shopify", description: "E-commerce platform", status: "available" },
                { name: "Slack", description: "Team communication", status: "available" },
                { name: "Google Analytics", description: "Website analytics", status: "connected" },
              ].map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={integration.status === "connected" ? "default" : "outline"}>
                      {integration.status === "connected" ? "Connected" : "Connect"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {integration.status === "connected" ? "Configure" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
