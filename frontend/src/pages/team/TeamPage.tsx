import { useEffect, useMemo, useState } from "react"
import {
  Search,
  Plus,
  Users,
  UserCheck,
  Building2,
  Mail,
  Crown,
  Trash2,
} from "lucide-react"

import Layout from "../../components/common/Layout"
import api from "../../services/api"
import useAuthStore from "../../store/authStore"

interface TeamUser {
  _id: string
  name: string
  email: string
  avatar?: string
}

interface TeamMember {
  _id: string
  user: TeamUser

  // Permission
  role: "admin" | "member"

  // Organization designation
  position: string

  joinedAt: string
}

interface Team {
  _id: string
  name: string
  createdBy: string
  members: TeamMember[]
}

export default function TeamPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const { user } = useAuthStore()
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  //create team modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [creatingTeam, setCreatingTeam] = useState(false)
  const [showCreateTeamButton, setShowCreateTeamButton] = useState(false)
  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [invitePosition, setInvitePosition] =
    useState("Frontend Developer")
  const [inviteLoading, setInviteLoading] =
    useState(false)

  const fetchTeam = async () => {
    try {
      setLoading(true)

      const res = await api.get("/team/my-team")

      setTeam(res.data.team)
      setShowCreateTeamButton(false)

      const onlineRes = await api.get("/team/online")
      setOnlineUsers(onlineRes.data.onlineUsers)

      setError("")
    } catch (err: any) {
      console.error(err)

      if (err.response?.status === 404) {
        setShowCreateTeamButton(true)
        setError("")
      } else {
        setError("Failed to load team.")
      }
    } finally {
      setLoading(false)
    }
  }


  console.log("Logged in user:", user?._id)

  console.log(
    "Current Member:",
    team?.members.find((m) => m.user._id === user?._id)
  )
  useEffect(() => {
    fetchTeam()
  }, [])

  const filteredMembers = useMemo(() => {
    if (!team) return []

    return team.members.filter((member) => {
      const value = search.toLowerCase()

      return (
        member.user.name.toLowerCase().includes(value) ||
        member.user.email.toLowerCase().includes(value) ||
        member.role.toLowerCase().includes(value) ||
        member.position.toLowerCase().includes(value)
      )
    })
  }, [team, search])

  const totalMembers = team?.members.length || 0

  // (Temporary)
  // We'll replace this with live socket presence later.
  const onlineMembers = onlineUsers.length

  const departments = 1

  const currentUser = team?.members.find(
    (member) => member.user._id === user?._id
  )

  const teamStats = [
    {
      label: "Total Members",
      value: totalMembers,
      icon: Users,
    },
    {
      label: "Online",
      value: onlineMembers,
      icon: UserCheck,
    },
    {
      label: "Departments",
      value: departments,
      icon: Building2,
    },
  ]

  const handleInvite = async () => {
    if (!inviteEmail) {
      alert("Email is required")
      return
    }

    try {
      setInviteLoading(true)

      const res = await api.post("/team/invite", {
        email: inviteEmail,
        role: inviteRole,
        position: invitePosition,
      })

      setTeam(res.data.team)

      await fetchTeam()

      alert("✅ Member invited successfully!")

      setShowInviteModal(false)

      setInviteEmail("")
      setInviteRole("member")
      setInvitePosition("Frontend Developer")

    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        "Failed to invite member"
      )
    } finally {
      setInviteLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      alert("Please enter a team name")
      return
    }

    try {
      setCreatingTeam(true)

      await api.post("/team", {
        name: teamName,
      })

      setShowCreateModal(false)
      setShowCreateTeamButton(false)
      setTeamName("")

      await fetchTeam()

      alert("✅ Team created successfully!")

    } catch (err: any) {

      alert(
        err.response?.data?.message ||
        "Failed to create team"
      )

    } finally {

      setCreatingTeam(false)

    }
  }

  const handleRemoveMember = async (memberId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this member from the team?"
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/team/member/${memberId}`)

      await fetchTeam()

      alert("✅ Member removed successfully!")
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        "Failed to remove member."
      )
    }
  }

  const handleLeaveTeam = async () => {

    const confirmLeave = window.confirm(
      "Are you sure you want to leave this team?"
    )

    if (!confirmLeave) return

    try {

      await api.delete("/team/leave")

      alert("✅ You left the team successfully.")

      await fetchTeam()

    } catch (err: any) {

      alert(
        err.response?.data?.message ||
        "Failed to leave team."
      )

    }

  }

  const handleDeleteTeam = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team? This cannot be undone."
    )

    if (!confirmDelete) return

    try {

      await api.delete("/team")

      alert("✅ Team deleted successfully.")

      await fetchTeam()

    } catch (err: any) {

      alert(
        err.response?.data?.message ||
        "Failed to delete team."
      )

    }

  }

  return (
    <Layout
      title={team?.name || "Team"}
      subtitle="Manage your team members"
    >
      <div className="space-y-6">

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamStats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">
                  {label}
                </p>

                <div className="bg-gray-800 p-2 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              <p className="text-white text-3xl font-semibold">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Search + Invite */}

        <div className="flex flex-col md:flex-row gap-4 justify-between">

          <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 w-full md:max-w-md">

            <Search className="w-4 h-4 text-gray-500" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team members..."
              className="bg-transparent outline-none flex-1 text-white"
            />

          </div>

          <div className="flex gap-3">

            {showCreateTeamButton ? (

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-5 py-3 rounded-xl text-white"
              >
                <Plus className="w-4 h-4" />
                Create Team
              </button>

            ) : (

              <>
                {currentUser?.role === "admin" && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-5 py-3 rounded-xl text-white"
                  >
                    <Plus className="w-4 h-4" />
                    Invite Member
                  </button>
                )}

                {currentUser?.role === "admin" ? (
                  <button
                    onClick={handleDeleteTeam}
                    className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition text-white"
                  >
                    Delete Team
                  </button>
                ) : (
                  <button
                    onClick={handleLeaveTeam}
                    className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 transition text-white"
                  >
                    Leave Team
                  </button>
                )}
              </>

            )}
          </div>

        </div>

        {/* Loading */}

        {loading && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {[1, 2, 3, 4].map((item) => (

              <div
                key={item}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse"
              >

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-full bg-gray-700" />

                  <div className="flex-1">

                    <div className="h-4 w-40 bg-gray-700 rounded mb-3" />

                    <div className="h-3 w-56 bg-gray-800 rounded" />

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* Error */}

        {!loading && error && (

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400">

            {error}

          </div>

        )}

        {/* Empty */}

        {!loading &&
          !error &&
          filteredMembers.length === 0 && (

            <div className="bg-gray-900 border border-gray-800 rounded-xl py-20 text-center">

              <Users className="mx-auto mb-4 w-12 h-12 text-gray-600" />

              <h2 className="text-white text-xl font-semibold">

                No Team Members

              </h2>

              <p className="text-gray-400 mt-2">

                Invite members to collaborate with you.

              </p>

            </div>

          )}

        {/* Members */}

        {!loading &&
          !error &&
          filteredMembers.length > 0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {filteredMembers.map((member) => {
                // console.log("Member:", member)
                const initials =
                  member.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()

                return (

                  <div
                    key={member._id}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition"
                  >
                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-4">

                        {member.user.avatar ? (
                          <img
                            src={member.user.avatar}
                            alt={member.user.name}
                            className="w-14 h-14 rounded-full object-cover border border-gray-700"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {initials}
                          </div>
                        )}

                        <div>

                          <h3 className="text-white font-semibold text-lg">
                            {member.user.name}
                          </h3>

                          <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">

                            <Mail className="w-4 h-4" />

                            {member.user.email}

                          </div>

                        </div>

                      </div>

                      {onlineUsers.includes(member.user._id) ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                          Online
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs">
                          Offline
                        </span>
                      )}

                    </div>

                    <div className="mt-6 space-y-3">

                      {/* Organization Position */}

                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-500">
                          Position
                        </p>

                        <p className="text-blue-400 font-semibold">
                          {member.position}
                        </p>

                      </div>

                      {/* Permission Role */}

                      <div className="flex items-center justify-between">

                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs font-medium ${member.role === "admin"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-gray-700 text-gray-300"
                            }`}
                        >
                          {member.role === "admin" && (
                            <Crown className="w-3 h-3" />
                          )}

                          {member.role.charAt(0).toUpperCase() +
                            member.role.slice(1)}
                        </div>

                        {currentUser?.role === "admin" &&
                          currentUser.user._id !== member.user._id && (
                            <button
                              onClick={() => handleRemoveMember(member.user._id)}
                              className="text-red-400 hover:text-red-300 transition"
                              title="Remove Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                      </div>

                      <span className="text-xs text-gray-500">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </span>
                    </div>

                  </div>

                )

              })}

            </div>

          )}

      </div>

      { /* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <h2 className="text-2xl font-semibold text-white mb-6">
              Invite Team Member
            </h2>

            {/* Email */}

            <div className="mb-4">

              <label className="block text-sm text-gray-400 mb-2">
                Email
              </label>

              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="member@example.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            {/* Position */}

            <div className="mb-4">

              <label className="block text-sm text-gray-400 mb-2">
                Position
              </label>

              <select
                value={invitePosition}
                onChange={(e) => setInvitePosition(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option>Project Manager</option>
                <option>Technical Lead</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Full Stack Developer</option>
                <option>UI/UX Designer</option>
                <option>QA Engineer</option>
                <option>DevOps Engineer</option>
                <option>Business Analyst</option>
                <option>Marketing Head</option>
                <option>Sales Executive</option>
                <option>HR Manager</option>
                <option>Intern</option>
              </select>

            </div>

            {/* Permission */}

            <div className="mb-6">

              <label className="block text-sm text-gray-400 mb-2">
                Permission
              </label>

              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowInviteModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleInvite}
                disabled={inviteLoading}
                className={`px-5 py-2 rounded-lg text-white transition
                    ${inviteLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500"
                  }`}
              >
                {inviteLoading ? "Inviting..." : "Invite"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/*create team modal*/}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <h2 className="text-2xl font-semibold text-white mb-6">
              Create Team
            </h2>

            <div className="mb-6">

              <label className="block text-sm text-gray-400 mb-2">
                Team Name
              </label>

              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              />

            </div>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateTeam}
                disabled={creatingTeam}
                className={`px-5 py-2 rounded-lg text-white transition ${creatingTeam
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
                  }`}
              >
                {creatingTeam ? "Creating..." : "Create Team"}
              </button>

            </div>

          </div>

        </div>
      )}

    </Layout>
  )
}