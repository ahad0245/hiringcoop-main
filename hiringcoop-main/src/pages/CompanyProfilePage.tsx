
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FiUpload, FiSave } from "react-icons/fi";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const supabaseAny = supabase as any;

interface CompanyData {
  name: string;
  logo_url: string;
  website: string;
  industry: string;
  size: string;
  founded: string;
  location: string;
  description: string;
  mission: string;
}

const emptyCompany: CompanyData = {
  name: '', logo_url: '', website: '', industry: '', size: '',
  founded: '', location: '', description: '', mission: ''
};

const CompanyProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [company, setCompany] = useState<CompanyData>(emptyCompany);
  const [formData, setFormData] = useState<CompanyData>(emptyCompany);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabaseAny.from('company_profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (data) {
        const c: CompanyData = {
          name: data.name || '', logo_url: data.logo_url || '', website: data.website || '',
          industry: data.industry || '', size: data.size || '', founded: data.founded || '',
          location: data.location || '', description: data.description || '', mission: data.mission || ''
        };
        setCompany(c);
        setFormData(c);
        setExists(true);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      if (exists) {
        await supabaseAny.from('company_profiles').update(formData).eq('user_id', user.id);
      } else {
        await supabaseAny.from('company_profiles').insert({ ...formData, user_id: user.id });
        setExists(true);
      }
      setCompany(formData);
      setIsEditing(false);
      toast({ title: 'Company profile saved' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    const file = e.target.files[0];
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/logo-${Date.now()}.${ext}`;
    setUploadingLogo(true);
    try {
      const { error } = await supabaseAny.storage.from('company-assets').upload(filePath, file);
      if (error) throw error;
      const { data: urlData } = supabaseAny.storage.from('company-assets').getPublicUrl(filePath);
      if (urlData) {
        const logoUrl = urlData.publicUrl;
        setFormData(prev => ({ ...prev, logo_url: logoUrl }));
        // Also persist immediately
        if (exists) {
          await supabaseAny.from('company_profiles').update({ logo_url: logoUrl }).eq('user_id', user.id);
        }
        setCompany(prev => ({ ...prev, logo_url: logoUrl }));
        toast({ title: 'Logo uploaded' });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Upload failed', description: err.message });
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="employer">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="employer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Company Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your company information visible to candidates</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => { setFormData(company); setIsEditing(false); }}>Cancel</Button>
              <Button type="submit" form="profile-form" disabled={saving}>
                <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        <form id="profile-form" onSubmit={handleSubmit}>
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-lg border border-border overflow-hidden flex items-center justify-center bg-muted">
                    {(isEditing ? formData.logo_url : company.logo_url) ? (
                      <img src={isEditing ? formData.logo_url : company.logo_url} alt="Company logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-muted-foreground">No Logo</span>
                    )}
                  </div>
                  <div>
                    <label htmlFor="logo-upload">
                      <Button type="button" variant="outline" disabled={uploadingLogo} asChild>
                        <div><FiUpload className="mr-2" /> {uploadingLogo ? 'Uploading...' : 'Upload Logo'}</div>
                      </Button>
                      <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">Recommended: Square image, at least 200x200px</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'name', label: 'Company Name' },
                    { id: 'website', label: 'Website', type: 'url' },
                    { id: 'industry', label: 'Industry' },
                    { id: 'size', label: 'Company Size' },
                    { id: 'founded', label: 'Founded' },
                    { id: 'location', label: 'Location' },
                  ].map(field => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        name={field.id}
                        type={field.type || 'text'}
                        value={(formData as any)[field.id]}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader><CardTitle>Company Description</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">About the Company</Label>
                <Textarea id="description" name="description" rows={5} value={formData.description} onChange={handleChange} disabled={!isEditing} className="resize-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission">Company Mission</Label>
                <Textarea id="mission" name="mission" rows={3} value={formData.mission} onChange={handleChange} disabled={!isEditing} className="resize-none" />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfilePage;
