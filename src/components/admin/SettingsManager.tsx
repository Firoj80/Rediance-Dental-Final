'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, Pencil } from 'lucide-react';

type Settings = {
  id: string;
  doctorName: string | null;
  doctorQualification: string | null;
  doctorExperience: string | null;
  doctorBio: string | null;
  doctorPhoto: string | null;
  doctorSpecializations: string | null;
  defaultSlotDuration: number;
  bookingAdvanceDays: number;
  statYears: string | null;
  statPatients: string | null;
  statServices: string | null;
  statRating: string | null;
  homeSeoTitle: string | null;
  homeSeoDescription: string | null;
};

type Clinic = {
  name: string;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  googleMapsUrl: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
};

export default function SettingsManager() {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changingPw, setChangingPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [clinicRes, settingsRes] = await Promise.all([
        adminFetch('/api/clinic'),
        adminFetch('/api/admin/settings'),
      ]);
      const clinicData = await clinicRes.json();
      const settingsData = await settingsRes.json();
      setClinic(clinicData);
      setSettings(settingsData);
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateClinicField = (field: keyof Clinic, value: string | null) => {
    setClinic((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateSettingsField = (field: keyof Settings, value: string | number) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const saveSettings = async () => {
    if (!settings || !clinic) return;
    setSaving(true);
    try {
      await adminFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          // Clinic fields
          name: clinic.name,
          tagline: clinic.tagline,
          description: clinic.description,
          phone: clinic.phone,
          email: clinic.email,
          whatsapp: clinic.whatsapp,
          address: clinic.address,
          googleMapsUrl: clinic.googleMapsUrl,
          facebook: clinic.facebook,
          instagram: clinic.instagram,
          youtube: clinic.youtube,
          // Settings fields
          doctorName: settings.doctorName,
          doctorQualification: settings.doctorQualification,
          doctorExperience: settings.doctorExperience,
          doctorBio: settings.doctorBio,
          doctorPhoto: settings.doctorPhoto,
          doctorSpecializations: settings.doctorSpecializations,
          defaultSlotDuration: settings.defaultSlotDuration,
          bookingAdvanceDays: settings.bookingAdvanceDays,
          statYears: settings.statYears,
          statPatients: settings.statPatients,
          statServices: settings.statServices,
          statRating: settings.statRating,
          homeSeoTitle: settings.homeSeoTitle,
          homeSeoDescription: settings.homeSeoDescription,
        }),
      });
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPw || !newPw || newPw !== confirmPw) {
      toast.error('Please fill all fields and ensure passwords match');
      return;
    }
    setChangingPw(true);
    try {
      const authRes = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: currentPw }),
      });
      if (!authRes.ok) {
        toast.error('Current password is incorrect');
        setChangingPw(false);
        return;
      }
      await adminFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ adminPassword: newPw }),
      });
      toast.success('Password changed');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch {
      toast.error('Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  if (loading || !clinic || !settings) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Clinic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Pencil className="h-3.5 w-3.5" /> Clinic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Clinic Name</Label>
              <Input value={clinic.name} onChange={(e) => updateClinicField('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={clinic.tagline || ''} onChange={(e) => updateClinicField('tagline', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={clinic.description || ''} onChange={(e) => updateClinicField('description', e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={clinic.phone || ''} onChange={(e) => updateClinicField('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={clinic.whatsapp || ''} onChange={(e) => updateClinicField('whatsapp', e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={clinic.email || ''} onChange={(e) => updateClinicField('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={clinic.address || ''} onChange={(e) => updateClinicField('address', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Google Maps Embed URL</Label>
            <Input placeholder="https://www.google.com/maps/embed?..." value={clinic.googleMapsUrl || ''} onChange={(e) => updateClinicField('googleMapsUrl', e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input placeholder="https://facebook.com/..." value={clinic.facebook || ''} onChange={(e) => updateClinicField('facebook', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input placeholder="https://instagram.com/..." value={clinic.instagram || ''} onChange={(e) => updateClinicField('instagram', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>YouTube URL</Label>
              <Input placeholder="https://youtube.com/..." value={clinic.youtube || ''} onChange={(e) => updateClinicField('youtube', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Doctor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={settings.doctorName || ''} onChange={(e) => updateSettingsField('doctorName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Qualification</Label>
              <Input value={settings.doctorQualification || ''} onChange={(e) => updateSettingsField('doctorQualification', e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Experience</Label>
              <Input value={settings.doctorExperience || ''} onChange={(e) => updateSettingsField('doctorExperience', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Photo URL</Label>
              <Input value={settings.doctorPhoto || ''} onChange={(e) => updateSettingsField('doctorPhoto', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Specializations (comma separated)</Label>
            <Input value={settings.doctorSpecializations || ''} onChange={(e) => updateSettingsField('doctorSpecializations', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea rows={4} value={settings.doctorBio || ''} onChange={(e) => updateSettingsField('doctorBio', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Appointment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appointment Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Default Slot Duration (minutes)</Label>
              <Input
                type="number"
                value={settings.defaultSlotDuration}
                onChange={(e) => updateSettingsField('defaultSlotDuration', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Booking Advance Days</Label>
              <Input
                type="number"
                value={settings.bookingAdvanceDays}
                onChange={(e) => updateSettingsField('bookingAdvanceDays', Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trust Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            {(['statYears', 'statPatients', 'statServices', 'statRating'] as const).map((key) => (
              <div key={key} className="space-y-2">
                <Label className="text-xs capitalize">{key.replace('stat', '')}</Label>
                <Input value={settings[key] || ''} onChange={(e) => updateSettingsField(key, e.target.value)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save All Settings
        </Button>
      </div>

      <Separator />

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
              >
                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showNewPw ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewPw(!showNewPw)}
              >
                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          {newPw && confirmPw && newPw !== confirmPw && (
            <p className="text-sm text-destructive">Passwords do not match</p>
          )}
          <div className="flex justify-end">
            <Button onClick={changePassword} disabled={changingPw || !currentPw || !newPw || newPw !== confirmPw}>
              {changingPw && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
