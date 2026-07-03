import { Request, Response } from "express";
import Team from "../models/Team";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";
import { getIO, rooms } from "../socket/socket";

export const getTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).populate(
      "members.user",
      "name email avatar"
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    return res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const createTeam = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const team = await Team.create({
      name,
      createdBy: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "admin",
          position: "Project Manager",
          joinedAt: new Date(),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      team,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create team",
    });
  }
};

export const getMyTeam = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const team = await Team.findOne({
      "members.user": req.user._id,
    }).populate("members.user", "name email avatar");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    return res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAdminPosition = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const team = await Team.findOne({
      "members.user": req.user._id,
    })

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      })
    }

    const member = team.members.find(
      (m: any) => m.user.toString() === req.user!._id
    )

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      })
    }

    member.position = "Project Manager"

    await team.save()

    return res.json({
      success: true,
      message: "Admin position updated",
    })
  } catch (err) {
    console.error(err)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

export const inviteMember = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { email, role, position } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!email || !role || !position) {
      return res.status(400).json({
        success: false,
        message: "Email, role and position are required.",
      });
    }

    // Find admin's team
    const team = await Team.findOne({
      "members.user": req.user._id,
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const currentMember = team.members.find(
      (member: any) =>
        member.user.toString() === req.user!._id.toString()
    );

    if (!currentMember || currentMember.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can invite members.",
      });
    }

    // Find invited user
    const invitedUser = await User.findOne({
      email,
    });

    if (!invitedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (invitedUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot invite yourself.",
      });
    }

    // Already exists?
    const exists = team.members.some(
      (member: any) =>
        member.user.toString() === invitedUser._id.toString()
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User is already in the team.",
      });
    }

    const allowedPositions = [
      "Project Manager",
      "Product Manager",
      "Technical Lead",
      "Team Lead",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "UI/UX Designer",
      "QA Engineer",
      "DevOps Engineer",
      "Business Analyst",
      "Marketing Manager",
      "HR Manager",
      "Sales Executive",
      "Intern",
    ];

    if (!allowedPositions.includes(position)) {
      return res.status(400).json({
        success: false,
        message: "Invalid position selected",
      });
    }
    // Add member
    team.members.push({
      user: invitedUser._id,
      role,
      position,
      joinedAt: new Date(),
    } as any);

    await Team.findByIdAndUpdate(
      team._id,
      {
        $push: {
          members: {
            user: invitedUser._id,
            role,
            position,
            joinedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    await team.populate(
      "members.user",
      "name email avatar"
    );

    const io = getIO();

    io.emit("team-updated", {
      teamId: team._id,
      member: invitedUser.name,
    });

    return res.status(200).json({
      success: true,
      message: "Member invited successfully.",
      team,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

export const removeTeamMember = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { memberId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const team = await Team.findOne({
      "members.user": req.user._id,
    }).select("name createdBy members");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Check if logged-in user is an admin
    const currentMember = team.members.find(
      (member: any) =>
        member.user.toString() === req.user!._id.toString()
    );

    if (!currentMember || currentMember.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can remove members.",
      });
    }

    // Prevent removing yourself
    if (memberId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself.",
      });
    }

    const memberExists = team.members.some(
      (member: any) => member.user.toString() === memberId
    );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    await Team.findByIdAndUpdate(
      team._id,
      {
        $pull: {
          members: { user: memberId }
        }
      },
      { new: true }
    );

    const io = getIO();

    io.emit("team-member-removed", {
      teamId: team._id,
      userId: memberId,
    });

    await team.populate("members.user", "name email avatar");

    return res.status(200).json({
      success: true,
      message: "Member removed successfully.",
      team,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const leaveTeam = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const team = await Team.findOne({
      "members.user": req.user._id,
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Owner cannot leave
    if (team.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Team owner cannot leave the team. Delete the team instead.",
      });
    }

    await Team.findByIdAndUpdate(team._id, {
      $pull: {
        members: {
          user: req.user._id,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "You left the team successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

export const deleteTeam = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const team = await Team.findOne({
      createdBy: req.user._id,
    });

    if (!team) {
      return res.status(403).json({
        success: false,
        message: "Only the team owner can delete the team.",
      });
    }

    await team.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};

export const getOnlineMembers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const team = await Team.findOne({
      "members.user": req.user._id,
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const memberIds = team.members.map((m: any) =>
      m.user.toString()
    );

    const onlineUsers = new Set<string>();

    Object.values(rooms).forEach((participants) => {
      participants.forEach((participant) => {
        if (memberIds.includes(participant.userId)) {
          onlineUsers.add(participant.userId);
        }
      });
    });

    return res.json({
      success: true,
      onlineUsers: [...onlineUsers],
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};