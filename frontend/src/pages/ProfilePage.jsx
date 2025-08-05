import {
  deleteAccountApi,
  getProfileApi,
  updateAccountDetailsApi,
  updatePersonalDetailsApi,
  updateProfileDetailsApi,
  updateProfilePictureApi,
} from "@/api/ProfileApiService"
import FullSizeLoader from "@/components/FullSizeLoader"
import { MultiSelectCombobox } from "@/components/MultiValueSelectComponent"
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
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage } from "@/utils/AxoisErrorHandler"
import { professionOptions } from "@/utils/TagOptions"
import { Dialog } from "@radix-ui/react-dialog"
import { Label } from "@radix-ui/react-dropdown-menu"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { debounce } from "lodash"
import { PencilIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function isDeepSubObject(sub, obj) {
  return Object.entries(sub).every(([key, value]) => {
    if (!(key in obj)) return false
    if (typeof value === "object" && value !== null) {
      return isDeepSubObject(value, obj[key])
    }
    return obj[key] === value
  })
}

function areStringArraysEqual(arr1, arr2) {
  return (
    arr1?.length === arr2?.length && arr1?.every((val, i) => val === arr2[i])
  )
}

export default function ProfilePage() {
  const [selectedValues, setSelectedValues] = useState([])
  const [profileData, setProfileData] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)

  const [personalDetails, setPersonalDetails] = useState({})
  const [profileDetails, setProfileDetails] = useState({})
  const [accountDetails, setAccountDetails] = useState({})

  const getProfileOfUser = async () => {
    try {
      const response = await getProfileApi()
      const { status, data } = response
      if (status === 200) {
        setProfileData(data)
        setSelectedValues(data?.professions)

        setPersonalDetails({
          username: data?.username,
          bio: data?.bio,
          createdAt: data?.date,
          profilePicture: data?.profilePicture,
        })

        setProfileDetails({
          location: data?.location,
          github: data?.github,
          linkedin: data?.linkedin,
          twitter: data?.twitter,
        })

        setAccountDetails({
          email: data?.email,
        })
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedImage(file)
  }

  const handleUpdateProfile = async () => {
    setLoading(true)

    if (!selectedImage) return

    const formData = new FormData()
    formData.append("image", selectedImage)

    try {
      const response = await updateProfilePictureApi(formData)
      const { status } = response
      if (status === 200) {
        await getProfileOfUser()
        toast.success("Profile picture updated successfully")
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePersonalDetails = debounce(async () => {
    if (personalDetails?.username.toLowerCase() === "admin") {
      toast.error("Username cannot be admin")
      return
    }

    setLoading(true)
    try {
      const response = await updatePersonalDetailsApi({
        ...personalDetails,
        professions: selectedValues,
      })
      const { status } = response
      if (status === 200) {
        await getProfileOfUser()
        toast.success("Personal details updated successfully")
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, 1000)

  const handleUpdateProfileDetails = debounce(async () => {
    setLoading(true)
    try {
      const response = await updateProfileDetailsApi(profileDetails)
      const { status } = response
      if (status === 200) {
        await getProfileOfUser()
        toast.success("Profile details updated successfully")
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  })

  const handleUpdateAccountDetails = debounce(async () => {
    setLoading(true)
    try {
      const response = await updateAccountDetailsApi(accountDetails)
      const { status } = response
      if (status === 200) {
        await getProfileOfUser()
        toast.success("Account details updated successfully")
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, 1000)

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      const response = await deleteAccountApi()
      const { status } = response
      if (status === 200) {
        await getProfileOfUser()
        toast.success("Account deleted successfully")
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfileOfUser()
  }, [])

  return (
    <motion.main
      className="container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-10"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {/* Full-Size Loader */}
      {loading && <FullSizeLoader />}

      {/* Profile Header */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-6 md:gap-8"
        variants={fadeInUp}
      >
        <div className="relative">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border border-foreground/20 overflow-hidden rounded-full">
            <AvatarImage
              src={
                personalDetails?.profilePicture
                  ? `${personalDetails.profilePicture}`
                  : "/placeholder.svg?height=128&width=128"
              }
              alt="User Avatar"
              className="object-cover w-full h-full"
            />
            {/* <AvatarImage
              src={
                personalDetails?.profilePicture
                  ? `data:image/jpeg;base64,${personalDetails.profilePicture}`
                  : "/placeholder.svg?height=128&width=128"
              }
              alt="User Avatar"
              className="object-cover w-full h-full"
            /> */}
            <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
              {personalDetails?.username?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-background border"
              >
                <PencilIcon className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault()
              }}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              <DialogHeader>
                <DialogTitle>Edit Profile Image</DialogTitle>
                <DialogDescription>
                  Select a new profile image for your profile.
                </DialogDescription>
              </DialogHeader>
              {selectedImage && (
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Preview"
                    className="w-48 h-48 object-cover rounded-xl shadow-md"
                  />
                </div>
              )}

              <div className="py-5 grid place-content-center gap-3">
                <Input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                />
                <Button onClick={handleUpdateProfile}>
                  Upload Selected Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Personal Details */}
        <div className="flex-1 text-center md:text-left p-3 bg-muted/20 rounded-md border w-full sm:w-auto">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {personalDetails?.username}
            </h1>
          </div>
          <div className="grid gap-3">
            <p className="text-sm md:text-lg">{selectedValues?.join(" | ")}</p>
            <p className="text-muted-foreground text-base line-clamp-4">
              {personalDetails?.bio}
            </p>
          </div>
          <p className="text-muted-foreground text-sm mt-4">
            Joined on:{" "}
            <span className="font-semibold">
              {personalDetails?.createdAt &&
                format(new Date(personalDetails?.createdAt), "dd MMMM yyyy")}
            </span>
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="mt-2 w-full">
                Edit Personal Details
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault()
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit Details</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <section className="space-y-1">
                  <Label htmlFor="name" className="text-sm">
                    Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    id="name"
                    name="username"
                    value={personalDetails?.username}
                    onChange={(e) =>
                      setPersonalDetails((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                  />
                </section>
                <section className="space-y-1">
                  <Label htmlFor="profession" className="text-sm">
                    Professions
                  </Label>
                  <MultiSelectCombobox
                    options={professionOptions}
                    selectedValues={selectedValues}
                    setSelectedValues={setSelectedValues}
                  />
                </section>
                <section className="space-y-1">
                  <Label htmlFor="bio" className="text-sm">
                    Bio
                  </Label>
                  <Textarea
                    type="text"
                    placeholder="John Doe"
                    className="h-52"
                    id="bio"
                    name="bio"
                    value={personalDetails?.bio}
                    onChange={(e) =>
                      setPersonalDetails((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }))
                    }
                  />
                </section>
                <Button
                  size="sm"
                  onClick={handleUpdatePersonalDetails}
                  className={
                    isDeepSubObject(personalDetails, profileData)
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  Update Personal Details
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Profile Details */}
      <motion.section
        variants={fadeInUp}
        className="space-y-4 border rounded-md bg-muted/20 p-3"
      >
        <h2 className="text-2xl font-semibold">Profile Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <section>
            <Label htmlFor="github">Github</Label>
            <Input
              type="text"
              placeholder="https://twitter.com/username"
              id="github"
              name="github"
              value={profileDetails?.github}
              onChange={(e) =>
                setProfileDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </section>
          <section>
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              placeholder="San Francisco, USA"
              id="location"
              name="location"
              value={profileDetails?.location}
              onChange={(e) =>
                setProfileDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </section>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <section>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              type="text"
              placeholder="https://twitter.com/username"
              id="twitter"
              name="twitter"
              value={profileDetails?.twitter}
              onChange={(e) =>
                setProfileDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </section>
          <section>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              type="text"
              placeholder="https://linkedin.com/in/username"
              id="linkedin"
              name="linkedin"
              value={profileDetails?.linkedin}
              onChange={(e) =>
                setProfileDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </section>
        </div>
        <div>
          <Button
            size="sm"
            onClick={handleUpdateProfileDetails}
            className={
              isDeepSubObject(profileDetails, profileData)
                ? "pointer-events-none opacity-50"
                : ""
            }
          >
            Save Changes
          </Button>
        </div>
      </motion.section>

      {/* Account Management */}
      <motion.section
        variants={fadeInUp}
        className="space-y-4 p-3 bg-muted/20 border rounded-md"
      >
        <div>
          <h2 className="text-2xl font-semibold">Account Settings</h2>
          <p className="text-muted-foreground text-sm">
            Start typing to change your email
          </p>
        </div>
        <div className="grid">
          <Input
            label="Change Email"
            name="email"
            readOnly
            placeholder="newemail@example.com"
            value={accountDetails?.email}
            onChange={(e) =>
              setAccountDetails((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>
        <Button
          size="sm"
          onClick={handleUpdateAccountDetails}
          className={`hidden ${
            isDeepSubObject(accountDetails, profileData)
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          Change Email
        </Button>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        className="p-3 space-y-2 border bg-muted/20 rounded-md"
      >
        <h1 className="text-2xl font-semibold">Delete Account</h1>
        <div className="space-y-3 p-3 bg-muted/40 rounded-md border">
          <p className="text-muted-foreground text-sm">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.section>
    </motion.main>
  )
}
