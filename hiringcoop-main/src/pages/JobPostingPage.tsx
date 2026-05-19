
import React, { useState } from 'react';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiTrash, FiSave } from "react-icons/fi";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const JobPostingPage = () => {
  const navigate = useNavigate();
  const tabOrder = ["details", "description", "questions"] as const;
  const [currentTab, setCurrentTab] = useState<(typeof tabOrder)[number]>("details");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "full-time", // full-time, part-time, contract, temporary, internship
    salary: {
      min: "",
      max: "",
      currency: "USD",
      period: "yearly" // yearly, monthly, weekly, hourly
    },
    department: "",
    experience: "mid-level", // entry-level, mid-level, senior-level, executive
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    requiredSkills: [""],
    videoQuestions: [
      "Tell us about yourself and why you're interested in this position.",
      "Describe a challenging project you've worked on and how you approached it."
    ],
    allowRemote: false,
    isActive: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        [name]: value
      }
    }));
  };

  const handleSalarySelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        [name]: value
      }
    }));
  };

  const handleRemoteToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allowRemote: checked
    }));
  };

  const handleStatusToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, ""]
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    setFormData(prev => {
      const updatedSkills = [...prev.requiredSkills];
      updatedSkills[index] = value;
      return {
        ...prev,
        requiredSkills: updatedSkills
      };
    });
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      videoQuestions: [...prev.videoQuestions, ""]
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videoQuestions: prev.videoQuestions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (index: number, value: string) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.videoQuestions];
      updatedQuestions[index] = value;
      return {
        ...prev,
        videoQuestions: updatedQuestions
      };
    });
  };

  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const currentTabIndex = tabOrder.indexOf(currentTab);
  const isLastTab = currentTabIndex === tabOrder.length - 1;

  const goToNextTab = () => {
    if (currentTabIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentTabIndex + 1]);
    }
  };

  const goToPreviousTab = () => {
    if (currentTabIndex > 0) {
      setCurrentTab(tabOrder[currentTabIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const sb = supabase as any;
      const { error } = await sb.from('jobs').insert({
        employer_id: user.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        job_type: formData.type,
        salary_min: formData.salary.min ? parseInt(formData.salary.min) : null,
        salary_max: formData.salary.max ? parseInt(formData.salary.max) : null,
        salary_currency: formData.salary.currency,
        requirements: formData.requiredSkills.filter(s => s.trim()),
        benefits: formData.benefits ? formData.benefits.split('\n').filter(b => b.trim()) : [],
        status: formData.isActive ? 'active' : 'draft',
      });
      if (error) throw error;
      toast({ title: 'Job posted successfully!' });
      navigate("/dashboard/jobs");
    } catch (err: any) {
      toast({ title: 'Error posting job', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <DashboardLayout userType="employer">
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate("/dashboard/jobs")}
          >
            <FiArrowLeft className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Job Posting</h1>
            <p className="text-gray-600 mt-1">
              Fill in the details to create a new job posting
            </p>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as (typeof tabOrder)[number])} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details">Job Details</TabsTrigger>
              <TabsTrigger value="description">Description & Requirements</TabsTrigger>
              <TabsTrigger value="questions">Video Questions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title*</Label>
                      <Input 
                        id="title" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Frontend Developer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="e.g. Engineering"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location*</Label>
                      <Input 
                        id="location" 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. New York, NY"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Job Type*</Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange(value, "type")} 
                        defaultValue={formData.type}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="temporary">Temporary</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level*</Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange(value, "experience")} 
                        defaultValue={formData.experience}
                      >
                        <SelectTrigger id="experience">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry-level">Entry Level</SelectItem>
                          <SelectItem value="mid-level">Mid Level</SelectItem>
                          <SelectItem value="senior-level">Senior Level</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-2 items-center mt-2">
                      <Switch 
                        id="remote"
                        checked={formData.allowRemote}
                        onCheckedChange={handleRemoteToggle}
                      />
                      <Label htmlFor="remote">Allow Remote Work</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Salary Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="min">Minimum</Label>
                      <Input 
                        id="min" 
                        name="min"
                        type="number"
                        value={formData.salary.min}
                        onChange={handleSalaryChange}
                        placeholder="e.g. 50000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max">Maximum</Label>
                      <Input 
                        id="max" 
                        name="max"
                        type="number"
                        value={formData.salary.max}
                        onChange={handleSalaryChange}
                        placeholder="e.g. 80000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        onValueChange={(value) => handleSalarySelectChange(value, "currency")} 
                        defaultValue={formData.salary.currency}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="period">Period</Label>
                      <Select 
                        onValueChange={(value) => handleSalarySelectChange(value, "period")} 
                        defaultValue={formData.salary.period}
                      >
                        <SelectTrigger id="period">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yearly">Per Year</SelectItem>
                          <SelectItem value="monthly">Per Month</SelectItem>
                          <SelectItem value="weekly">Per Week</SelectItem>
                          <SelectItem value="hourly">Per Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description*</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide a detailed description of the position..."
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsibilities">Key Responsibilities*</Label>
                    <Textarea 
                      id="responsibilities" 
                      name="responsibilities"
                      rows={5}
                      value={formData.responsibilities}
                      onChange={handleChange}
                      placeholder="List the key responsibilities of the role..."
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements*</Label>
                    <Textarea 
                      id="requirements" 
                      name="requirements"
                      rows={5}
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="List education, experience, and other requirements..."
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea 
                      id="benefits" 
                      name="benefits"
                      rows={4}
                      value={formData.benefits}
                      onChange={handleChange}
                      placeholder="List benefits offered with this position..."
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.requiredSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        placeholder={`Skill ${index + 1}`}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeSkill(index)}
                        disabled={formData.requiredSkills.length <= 1}
                      >
                        <FiTrash size={18} />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={addSkill}
                    className="mt-2"
                  >
                    <FiPlus className="mr-2" /> Add Skill
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions">
              <Card>
                <CardHeader>
                  <CardTitle>Video Interview Questions</CardTitle>
                  <p className="text-gray-500 text-sm">
                    Add questions that candidates will answer in their video application
                  </p>
                </CardHeader>
                <CardContent>
                  {formData.videoQuestions.map((question, index) => (
                    <div key={index} className="flex items-start gap-2 mb-4">
                      <div className="flex-1">
                        <Label htmlFor={`question-${index}`} className="mb-1 block">
                          Question {index + 1}
                        </Label>
                        <Textarea
                          id={`question-${index}`}
                          value={question}
                          onChange={(e) => handleQuestionChange(index, e.target.value)}
                          placeholder="Enter interview question"
                          className="resize-none"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeQuestion(index)}
                        disabled={formData.videoQuestions.length <= 1}
                        className="mt-8"
                      >
                        <FiTrash size={18} />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={addQuestion}
                    className="mt-2"
                  >
                    <FiPlus className="mr-2" /> Add Question
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6">
            <div className="flex items-center space-x-2">
              <Switch 
                id="status"
                checked={formData.isActive}
                onCheckedChange={handleStatusToggle}
              />
              <Label htmlFor="status">
                {formData.isActive ? "Job posting will be active" : "Save as draft"}
              </Label>
            </div>
            <div className="flex space-x-2">
              {currentTabIndex > 0 && (
                <Button type="button" variant="outline" onClick={goToPreviousTab}>
                  Previous
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard/jobs")}
              >
                Cancel
              </Button>
              {isLastTab ? (
                <Button type="button" disabled={saving} onClick={handleSubmit}>
                  <FiSave className="mr-2" /> {saving ? 'Publishing...' : 'Publish Job'}
                </Button>
              ) : (
                <Button type="button" onClick={goToNextTab}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingPage;
