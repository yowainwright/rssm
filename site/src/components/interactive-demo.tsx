"use client";

import { useState } from "react";
import { z } from "zod";
import { createRSSSM } from "../../../dist/index.mjs";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Example schema for a user object
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().positive(),
  active: z.boolean(),
});

type User = z.infer<typeof userSchema>;

// Create RSSSM instance
const { RSSMProvider, useRSSSM } = createRSSSM<User>("demoUser");

// Default user data
const defaultUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  active: true,
};

function DemoContent() {
  const { data, loading, error, actions } = useRSSSM();
  const [formData, setFormData] = useState<Partial<User>>(defaultUser);
  const [updateData, setUpdateData] = useState<Partial<User>>({});

  // Initialize with default data
  if (!loading && !data && !error) {
    actions.create(defaultUser);
    return null;
  }

  const handleCreate = () => {
    try {
      const newUser: User = {
        id: formData.id || Date.now().toString(),
        name: formData.name || "",
        email: formData.email || "",
        age: formData.age || 0,
        active: formData.active !== undefined ? formData.active : true,
      };
      
      // Validate with schema
      userSchema.parse(newUser);
      actions.create(newUser);
      setFormData({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        actions.setError(err.errors.map(e => e.message).join(", "));
      }
    }
  };

  const handleUpdate = () => {
    if (Object.keys(updateData).length > 0) {
      actions.update(updateData);
      setUpdateData({});
    }
  };

  const handleDestroy = () => {
    actions.destroy();
    setFormData(defaultUser);
  };

  const handleReset = () => {
    actions.reset();
    setFormData(defaultUser);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Controls */}
      <div className="space-y-6">
        {/* Create Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create / Read</CardTitle>
            <CardDescription>
              Create new data or read existing data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={formData.id || ""}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="Enter ID"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ""}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                placeholder="Enter age"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active || false}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="active">Active</Label>
            </div>
            <Button onClick={handleCreate} className="w-full">
              Create New Data
            </Button>
          </CardContent>
        </Card>

        {/* Update Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update</CardTitle>
            <CardDescription>
              Update specific fields (leave empty to skip)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="update-name">Name</Label>
              <Input
                id="update-name"
                value={updateData.name || ""}
                onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                placeholder="New name (optional)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="update-email">Email</Label>
              <Input
                id="update-email"
                type="email"
                value={updateData.email || ""}
                onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                placeholder="New email (optional)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="update-age">Age</Label>
              <Input
                id="update-age"
                type="number"
                value={updateData.age || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setUpdateData({ ...updateData, age: val ? parseInt(val) : undefined });
                }}
                placeholder="New age (optional)"
              />
            </div>
            <Button 
              onClick={handleUpdate} 
              className="w-full"
              disabled={Object.keys(updateData).length === 0}
            >
              Update Data
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Other state management actions
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button onClick={handleReset} variant="outline">
              Reset to Initial
            </Button>
            <Button onClick={handleDestroy} variant="destructive">
              Destroy (Clear All)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* State Display */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current State</CardTitle>
            <CardDescription>
              Real-time view of your RSSSM state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Indicators */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${loading ? "bg-yellow-500" : "bg-green-500"}`} />
                  <span>{loading ? "Loading" : "Ready"}</span>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Error</span>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* Data Display */}
              <div className="rounded-md bg-muted p-4">
                <pre className="text-sm">
                  <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
              </div>

              {/* LocalStorage Info */}
              <div className="text-sm text-muted-foreground">
                <p>💾 Data is persisted to localStorage</p>
                <p>🔑 Key: <code className="rounded bg-muted px-1">demoUser</code></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schema Display */}
        <Card>
          <CardHeader>
            <CardTitle>Schema Definition</CardTitle>
            <CardDescription>
              Zod schema used for validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-md bg-muted p-4 text-sm overflow-x-auto">
              <code>{`const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().positive(),
  active: z.boolean(),
});`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function InteractiveDemo() {
  return (
    <RSSMProvider
      schema={userSchema}
      name="demoUser"
      persist={true}
      logging={true}
    >
      <DemoContent />
    </RSSMProvider>
  );
}