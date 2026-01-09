import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload, X } from "lucide-react";
import { selectAuthInfo, setAuthInfo, type IAuthInfo } from "@/store/authSlice";
import { Link } from "react-router";
import {
  useUpdateUserProfileMutation,
  type UpdateUserProfileRequest,
} from "@/store/rtk/userApi";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/types/useRedux";

const UserProfileForm = () => {
  const userInfo: IAuthInfo | null = useAppSelector(selectAuthInfo);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const [
    updateProfile,
    {
      // isLoading
    },
  ] = useUpdateUserProfileMutation();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a JPEG or PNG image");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userInfo) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const updateData = formData as unknown as UpdateUserProfileRequest;

      const response = await updateProfile(updateData).unwrap();

      console.log(response);
      if (response.success) {
        toast.success("Profile picture upload successfully!");

        dispatch(setAuthInfo(response.user));
      }

      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // const handleRemove = async () => {
  //   if (!userInfo) return;

  //   try {
  //     // Create an empty FormData to trigger removal
  //     // Note: You need to check if your backend supports this approach
  //     // If not, you might need a separate API endpoint for removal
  //     const formData = new FormData();

  //     // Type assertion
  //     const updateData = formData as unknown as UpdateUserProfileRequest;

  //     // const response = await updateProfile(updateData).unwrap();
  //     // console.log(response);
  //     // if (response.success) {
  //     //   toast.success("Profile picture removed successfully!");
  //     //   setCookie("authInfo", JSON.stringify(response.user));
  //     // }

  //     // Clear preview if any
  //     setPreviewUrl(null);
  //     setSelectedFile(null);
  //   } catch (error) {
  //     console.error("Remove failed:", error);
  //     toast.error("Failed to remove profile picture. Please try again.");
  //   }
  // };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!userInfo) {
    return (
      <Card className="w-full max-w-2xl bg-white text-black border border-gray-200">
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-600">Loading user profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentProfileImage = previewUrl || userInfo.profile;

  return (
    <Card className="w-full max-w-2xl bg-white text-black border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
        <CardDescription className="text-gray-600">
          Manage your account information and preferences
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-6 md:space-y-0">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-2 border-gray-300">
              <AvatarImage
                src={currentProfileImage || "https://github.com/shadcn.png"}
                alt={"User Profile"}
              />
              <AvatarFallback className="bg-gray-800 text-white text-2xl">
                {getInitials(userInfo.name)}
              </AvatarFallback>
            </Avatar>

            {selectedFile && (
              <div className="flex space-x-2">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Save Picture
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-300 hover:bg-gray-100 text-black"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4 flex-1">
            <h3 className="text-lg font-semibold">Profile Picture</h3>
            <p className="text-sm text-gray-600">
              Upload a new profile image (JPEG, PNG, max 2MB)
            </p>

            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                id="profile-upload"
              />

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-100 text-black"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>

                {selectedFile && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-700 truncate max-w-xs">
                      {selectedFile.name}
                    </span>
                    <span className="text-gray-500">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
              {/* 
              {userInfo.profile && !selectedFile && (
                <Button
                  variant="ghost"
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-black hover:bg-gray-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Remove Current Picture"
                  )}
                </Button>
              )} */}

              {/* {selectedFile && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Click "Save Picture" to upload your
                    selected image. This will replace your current profile
                    picture.
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Name Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label htmlFor="name" className="text-base font-medium">
                Full Name
              </Label>
              <p className="text-gray-700 mt-1">{userInfo.name}</p>
            </div>
            <Link to="/profile/update-name">
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 text-black"
              >
                Change Name
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Email Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label htmlFor="email" className="text-base font-medium">
                Email Address
              </Label>
              <p className="text-gray-700 mt-1">{userInfo.email}</p>
            </div>
            <Link to="/profile/update-email">
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 text-black"
              >
                Change Email
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Role Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-base font-medium">Account Type</Label>
              <p className="text-gray-700 mt-1 capitalize">{userInfo.role}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Password Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label className="text-base font-medium">Password</Label>
              <p className="text-gray-700 mt-1">
                Last changed 30 days ago {/* Replace with actual data */}
              </p>
            </div>
            <Link to="/profile/reset-password">
              <Button className="bg-black text-white hover:bg-gray-800">
                Reset Password
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
