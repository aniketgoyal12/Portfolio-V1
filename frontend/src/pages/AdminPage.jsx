import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getCookie } from "@/utils/api";
import { toast } from "sonner";
import { 
    Lock, Plus, Edit2, Trash2, LogOut, Globe, Github, 
    Sparkles, Check, X, ShieldAlert, AlertTriangle, ArrowLeft, ExternalLink
} from "lucide-react";
import HudCard from "@/components/HudCard";

const AdminPage = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Auth Form State
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    // Tab State
    const [activeTab, setActiveTab] = useState("projects");

    // Profile State
    const [profileBioP1, setProfileBioP1] = useState("");
    const [profileBioP2, setProfileBioP2] = useState("");
    const [profileStack, setProfileStack] = useState("MERN");
    const [profileExperience, setProfileExperience] = useState("Full Stack — 1 yr projects");
    const [profileAvailability, setProfileAvailability] = useState("Open to internships");
    const [profileStatus, setProfileStatus] = useState("Active");
    const [profileOwnerEmail, setProfileOwnerEmail] = useState("");
    const [profileDefaultFromEmail, setProfileDefaultFromEmail] = useState("");
    const [profileLogoInitials, setProfileLogoInitials] = useState("AG");
    const [profileFirstName, setProfileFirstName] = useState("Aniket");
    const [profileLastName, setProfileLastName] = useState("Goyal");
    const [profileHeroTitleP1, setProfileHeroTitleP1] = useState("");
    const [profileHeroTitleP2, setProfileHeroTitleP2] = useState("");
    const [profileHeroSubtitle, setProfileHeroSubtitle] = useState("");
    const [profileGithubUrl, setProfileGithubUrl] = useState("");
    const [profileGithubLabel, setProfileGithubLabel] = useState("");
    const [profileLinkedinUrl, setProfileLinkedinUrl] = useState("");
    const [profileLinkedinLabel, setProfileLinkedinLabel] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);

    // Missions Dashboard State
    const [missions, setMissions] = useState([]);
    const [missionsLoading, setMissionsLoading] = useState(false);
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
    const [editingMission, setEditingMission] = useState(null);
    const [deleteMissionConfirmId, setDeleteMissionConfirmId] = useState(null);
    
    // Mission Form Fields
    const [missionRole, setMissionRole] = useState("");
    const [missionOrg, setMissionOrg] = useState("");
    const [missionPeriod, setMissionPeriod] = useState("");
    const [missionContributions, setMissionContributions] = useState("");
    const [missionOrder, setMissionOrder] = useState(0);

    // Certifications Dashboard State
    const [certifications, setCertifications] = useState([]);
    const [certificationsLoading, setCertificationsLoading] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState(null);
    const [deleteCertConfirmId, setDeleteCertConfirmId] = useState(null);

    // Certification Form Fields
    const [certTitle, setCertTitle] = useState("");
    const [certIssuer, setCertIssuer] = useState("");
    const [certStatus, setCertStatus] = useState("UNLOCKED");
    const [certLink, setCertLink] = useState("");
    const [certOrder, setCertOrder] = useState(0);

    // Projects Dashboard State
    const [projects, setProjects] = useState([]);
    // Categories Dashboard State
    const [categories, setCategories] = useState([]);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [deleteCategoryConfirmId, setDeleteCategoryConfirmId] = useState(null);

    // Skills Dashboard State
    const [skills, setSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(false);

    // Skill Modal State
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [deleteSkillConfirmId, setDeleteSkillConfirmId] = useState(null);

    // Form fields for Skill Editor
    const [skillName, setSkillName] = useState("");
    const [skillCategory, setSkillCategory] = useState("Programming Languages");
    const [skillColor, setSkillColor] = useState("accent");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Form fields for Editor
    const [formName, setFormName] = useState("");
    const [formSlugId, setFormSlugId] = useState("");
    const [formCodename, setFormCodename] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formLongDescription, setFormLongDescription] = useState("");
    const [formLiveLink, setFormLiveLink] = useState("");
    const [formRepoLink, setFormRepoLink] = useState("");
    const [formCategory, setFormCategory] = useState("");
    const [formFeatured, setFormFeatured] = useState(false);
    
    // Complex fields: List builder & Chips
    const [formTechInput, setFormTechInput] = useState("");
    const [formTechStack, setFormTechStack] = useState([]);
    
    const [formHighlightInput, setFormHighlightInput] = useState("");
    const [formHighlights, setFormHighlights] = useState([]);
    
    const [formImageFile, setFormImageFile] = useState(null);
    const [formImagePreview, setFormImagePreview] = useState("");

    // Listen to expired auth events
    useEffect(() => {
        const handleAuthExpired = () => {
            setIsAuthenticated(false);
            toast.error("Session expired. Please log in again.");
        };
        window.addEventListener('auth-expired', handleAuthExpired);
        return () => window.removeEventListener('auth-expired', handleAuthExpired);
    }, []);

    // Check if authenticated on mount
    const fetchMissions = async () => {
        setMissionsLoading(true);
        try {
            const res = await apiFetch("/api/missions/");
            if (res.ok) {
                const data = await res.json();
                setMissions(data);
            }
        } catch (err) {
            toast.error("Failed to load timeline missions.");
        } finally {
            setMissionsLoading(false);
        }
    };

    const fetchCertifications = async () => {
        setCertificationsLoading(true);
        try {
            const res = await apiFetch("/api/certifications/");
            if (res.ok) {
                const data = await res.json();
                setCertifications(data);
            }
        } catch (err) {
            toast.error("Failed to load certifications database.");
        } finally {
            setCertificationsLoading(false);
        }
    };

    // Check if authenticated on mount
    const fetchProfile = async () => {
        try {
            const res = await apiFetch("/api/profile/");
            if (res.ok) {
                const data = await res.json();
                setProfileBioP1(data.bio_p1 || "");
                setProfileBioP2(data.bio_p2 || "");
                setProfileStack(data.stack || "MERN");
                setProfileExperience(data.experience || "Full Stack — 1 yr projects");
                setProfileAvailability(data.availability || "Open to internships");
                setProfileStatus(data.status || "Active");
                setProfileOwnerEmail(data.owner_email || "");
                setProfileDefaultFromEmail(data.default_from_email || "");
                setProfileLogoInitials(data.logo_initials || "AG");
                setProfileFirstName(data.first_name || "Aniket");
                setProfileLastName(data.last_name || "Goyal");
                setProfileHeroTitleP1(data.hero_title_p1 || "");
                setProfileHeroTitleP2(data.hero_title_p2 || "");
                setProfileHeroSubtitle(data.hero_subtitle || "");
                setProfileGithubUrl(data.github_url || "");
                setProfileGithubLabel(data.github_label || "");
                setProfileLinkedinUrl(data.linkedin_url || "");
                setProfileLinkedinLabel(data.linkedin_label || "");
            }
        } catch (err) {
            console.error("Failed to load profile details", err);
        }
    };

    // Check if authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await apiFetch("/api/auth/verify/");
                if (res.ok) {
                    setIsAuthenticated(true);
                    // Fetch lists for admin view
                    const [projectsRes, skillsRes, missionsRes, certsRes, catsRes] = await Promise.all([
                        apiFetch("/api/projects/"),
                        apiFetch("/api/skills/"),
                        apiFetch("/api/missions/"),
                        apiFetch("/api/certifications/"),
                        apiFetch("/api/categories/")
                    ]);
                    if (projectsRes.ok) {
                        const data = await projectsRes.json();
                        setProjects(data);
                    }
                    if (skillsRes.ok) {
                        const data = await skillsRes.json();
                        setSkills(data);
                    }
                    if (missionsRes.ok) {
                        const data = await missionsRes.json();
                        setMissions(data);
                    }
                    if (certsRes.ok) {
                        const data = await certsRes.json();
                        setCertifications(data);
                    }
                    if (catsRes.ok) {
                        const data = await catsRes.json();
                        setCategories(data);
                    }
                    fetchProfile();
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthLoading(true);

        try {
            const res = await apiFetch("/api/auth/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                toast.success("Identity verified. System unlocked.");
                setIsAuthenticated(true);
                // Load projects & skills
                const [projectsRes, skillsRes, missionsRes, certsRes, catsRes] = await Promise.all([
                    apiFetch("/api/projects/"),
                    apiFetch("/api/skills/"),
                    apiFetch("/api/missions/"),
                    apiFetch("/api/certifications/"),
                    apiFetch("/api/categories/")
                ]);
                if (projectsRes.ok) {
                    const data = await projectsRes.json();
                    setProjects(data);
                }
                if (skillsRes.ok) {
                    const data = await skillsRes.json();
                    setSkills(data);
                }
                if (missionsRes.ok) {
                    const data = await missionsRes.json();
                    setMissions(data);
                }
                if (certsRes.ok) {
                    const data = await certsRes.json();
                    setCertifications(data);
                }
                if (catsRes.ok) {
                    const data = await catsRes.json();
                    setCategories(data);
                }
                fetchProfile();
            } else {
                let errMsg = "Decryption failed. Invalid credentials.";
                try {
                    const data = await res.json();
                    if (data && data.detail) {
                        errMsg = data.detail;
                    }
                } catch (e) {}
                toast.error(errMsg);
            }
        } catch (err) {
            toast.error("Failed to connect to authentication server.");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await apiFetch("/api/auth/logout/", { method: "POST" });
        } catch (err) {
            console.error("Logout request failed:", err);
        } finally {
            setIsAuthenticated(false);
            // Clear local storage and session storage
            localStorage.clear();
            sessionStorage.clear();
            toast.success("Secure connection terminated.");
            // Force page reload to clear all React state, query cache, and JS memory
            window.location.href = "/admin";
        }
    };


    const handleToggleFeatured = async (id, currentVal) => {
        try {
            // Find project and optimistically update local state
            setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !currentVal } : p));

            const res = await apiFetch(`/api/projects/${id}/toggle-featured/`, {
                method: "PATCH"
            });

            if (!res.ok) {
                throw new Error();
            }
            toast.success("Project featured state synchronized.");
        } catch (err) {
            // Revert state on failure
            setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: currentVal } : p));
            toast.error("Failed to update featured state.");
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            const res = await apiFetch(`/api/projects/${id}/`, {
                method: "DELETE"
            });

            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== id));
                toast.success("Payload pathway purged.");
                setDeleteConfirmId(null);
            } else {
                toast.error("Deletion rejected by core.");
            }
        } catch (err) {
            toast.error("Network failure during purge operation.");
        }
    };

    const fetchSkills = async () => {
        skillsLoading || setSkillsLoading(true);
        try {
            const res = await apiFetch("/api/skills/");
            if (res.ok) {
                const data = await res.json();
                setSkills(data);
            }
        } catch (err) {
            toast.error("Failed to load skills database.");
        } finally {
            setSkillsLoading(false);
        }
    };

    const openSkillEditor = (skill = null) => {
        setEditingSkill(skill);
        if (skill) {
            setSkillName(skill.name);
            setSkillCategory(skill.category);
            setSkillColor(skill.color);
        } else {
            setSkillName("");
            setSkillCategory("Programming Languages");
            setSkillColor("accent");
        }
        setIsSkillModalOpen(true);
    };

    const handleSaveSkill = async (e) => {
        e.preventDefault();
        const payload = {
            name: skillName.trim(),
            category: skillCategory.trim(),
            color: skillColor
        };

        if (!payload.name || !payload.category) {
            toast.error("All fields are required.");
            return;
        }

        try {
            let res;
            if (editingSkill) {
                res = await apiFetch(`/api/skills/${editingSkill.id}/`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await apiFetch("/api/skills/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                toast.success(editingSkill ? "Capability updated." : "Capability logged.");
                setIsSkillModalOpen(false);
                fetchSkills();
            } else {
                const errData = await res.json();
                toast.error(errData.name ? "Skill name must be unique." : "Operation failed.");
            }
        } catch (err) {
            toast.error("Network communication failure.");
        }
    };

    const handleDeleteSkill = async (id) => {
        try {
            const res = await apiFetch(`/api/skills/${id}/`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Capability purged.");
                setDeleteSkillConfirmId(null);
                fetchSkills();
            } else {
                toast.error("Purge operation failed.");
            }
        } catch (err) {
            toast.error("Network communication failure.");
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        const payload = {
            bio_p1: profileBioP1.trim(),
            bio_p2: profileBioP2.trim(),
            stack: profileStack.trim(),
            experience: profileExperience.trim(),
            availability: profileAvailability.trim(),
            status: profileStatus.trim(),
            owner_email: profileOwnerEmail.trim(),
            default_from_email: profileDefaultFromEmail.trim(),
            logo_initials: profileLogoInitials.trim(),
            first_name: profileFirstName.trim(),
            last_name: profileLastName.trim(),
            hero_title_p1: profileHeroTitleP1.trim(),
            hero_title_p2: profileHeroTitleP2.trim(),
            hero_subtitle: profileHeroSubtitle.trim(),
            github_url: profileGithubUrl.trim(),
            github_label: profileGithubLabel.trim(),
            linkedin_url: profileLinkedinUrl.trim(),
            linkedin_label: profileLinkedinLabel.trim()
        };

        try {
            const res = await apiFetch("/api/profile/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("System overview diagnostics updated.");
                fetchProfile();
            } else {
                toast.error("Failed to update system diagnostics.");
            }
        } catch (err) {
            toast.error("Network communication failure.");
        } finally {
            setProfileLoading(false);
        }
    };

    // Mission Log Operations
    const openMissionEditor = (mission = null) => {
        setEditingMission(mission);
        if (mission) {
            setMissionRole(mission.role);
            setMissionOrg(mission.organization);
            setMissionPeriod(mission.period);
            setMissionContributions((mission.contributions || []).join("\n"));
            setMissionOrder(mission.order || 0);
        } else {
            setMissionRole("");
            setMissionOrg("");
            setMissionPeriod("");
            setMissionContributions("");
            setMissionOrder(0);
        }
        setIsMissionModalOpen(true);
    };

    const handleSaveMission = async (e) => {
        e.preventDefault();
        const payload = {
            role: missionRole.trim(),
            organization: missionOrg.trim(),
            period: missionPeriod.trim(),
            contributions: missionContributions.split("\n").map(c => c.trim()).filter(Boolean),
            order: parseInt(missionOrder) || 0
        };

        try {
            let res;
            if (editingMission) {
                res = await apiFetch(`/api/missions/${editingMission.id}/`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await apiFetch("/api/missions/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                toast.success(editingMission ? "Mission log updated." : "Mission log created.");
                setIsMissionModalOpen(false);
                fetchMissions();
            } else {
                toast.error("Failed to save mission log.");
            }
        } catch (err) {
            toast.error("Network communication failure.");
        }
    };

    const handleDeleteMission = async (id) => {
        try {
            const res = await apiFetch(`/api/missions/${id}/`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Mission log purged.");
                setDeleteMissionConfirmId(null);
                fetchMissions();
            } else {
                toast.error("Failed to purge mission log.");
            }
        } catch (err) {
            toast.error("Network communication failure.");
        }
    };

    // Certification Operations
    const openCertEditor = (cert = null) => {
        setEditingCert(cert);
        if (cert) {
            setCertTitle(cert.title);
            setCertIssuer(cert.issuer);
            setCertStatus(cert.status || "UNLOCKED");
            setCertLink(cert.link || "");
            setCertOrder(cert.order || 0);
        } else {
            setCertTitle("");
            setCertIssuer("");
            setCertStatus("UNLOCKED");
            setCertLink("");
            setCertOrder(0);
        }
        setIsCertModalOpen(true);
    };

    const handleSaveCert = async (e) => {
        e.preventDefault();
        const payload = {
            title: certTitle.trim(),
            issuer: certIssuer.trim(),
            status: certStatus.trim(),
            link: certLink.trim(),
            order: parseInt(certOrder) || 0
        };

        try {
            let res;
            if (editingCert) {
                res = await apiFetch(`/api/certifications/${editingCert.id}/`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await apiFetch("/api/certifications/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                toast.success(editingCert ? "Certification updated." : "Certification logged.");
                setIsCertModalOpen(false);
                fetchCertifications();
            } else {
                toast.error("Failed to save certification.");
            }
        } catch (err) {
            toast.error("Network communication failure.");
        }
    };

    const handleDeleteCert = async (id) => {
        try {
            const res = await apiFetch(`/api/certifications/${id}/`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Certification purged.");
                setDeleteCertConfirmId(null);
                fetchCertifications();
            } else {
                toast.error("Failed to purge certification.");
            }
        } catch (err) {
            toast.error("Network communication failure.");
        }
    };

    const openCategoryEditor = (cat = null) => {
        if (cat) {
            setEditingCategory(cat);
            setCategoryName(cat.name);
        } else {
            setEditingCategory(null);
            setCategoryName("");
        }
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        const payload = { name: categoryName.trim() };
        if (!payload.name) {
            toast.error("Category name cannot be empty.");
            return;
        }

        try {
            let res;
            if (editingCategory) {
                res = await apiFetch(`/api/categories/${editingCategory.id}/`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await apiFetch("/api/categories/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                const savedCat = await res.json();
                if (editingCategory) {
                    setCategories(prev => prev.map(c => c.id === editingCategory.id ? savedCat : c));
                    toast.success("Category configuration synchronized.");
                } else {
                    setCategories(prev => [...prev, savedCat]);
                    toast.success("New category registered.");
                }
                setIsCategoryModalOpen(false);
            } else {
                const errData = await res.json();
                toast.error(errData.name ? errData.name[0] : "Category synchronization failed.");
            }
        } catch (err) {
            toast.error("Network interface connection failure.");
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const res = await apiFetch(`/api/categories/${id}/`, {
                method: "DELETE"
            });
            if (res.ok) {
                setCategories(prev => prev.filter(c => c.id !== id));
                toast.success("Category deleted from registry.");
                setDeleteCategoryConfirmId(null);
            } else {
                toast.error("Deletion rejected by core.");
            }
        } catch (err) {
            toast.error("Network interface connection failure.");
        }
    };

    const openEditor = (project = null) => {
        setEditingProject(project);
        if (project) {
            setFormName(project.name);
            setFormSlugId(project.slug_id);
            setFormCodename(project.codename);
            setFormDescription(project.description);
            setFormLongDescription(project.long_description);
            setFormLiveLink(project.live_link);
            setFormRepoLink(project.repo_link);
            setFormCategory(project.category);
            setFormFeatured(project.featured);
            setFormTechStack(project.tech_stack || []);
            setFormHighlights(project.highlights || []);
            setFormImagePreview(project.image || "");
        } else {
            setFormName("");
            setFormSlugId("");
            setFormCodename("");
            setFormDescription("");
            setFormLongDescription("");
            setFormLiveLink("#");
            setFormRepoLink("#");
            setFormCategory("Frontend");
            setFormFeatured(false);
            setFormTechStack([]);
            setFormHighlights([]);
            setFormImagePreview("");
        }
        setFormTechInput("");
        setFormHighlightInput("");
        setFormImageFile(null);
        setIsModalOpen(true);
    };

    const handleAddTech = () => {
        const trimmed = formTechInput.trim();
        if (trimmed && !formTechStack.includes(trimmed)) {
            setFormTechStack([...formTechStack, trimmed]);
            setFormTechInput("");
        }
    };

    const handleRemoveTech = (tech) => {
        setFormTechStack(formTechStack.filter(t => t !== tech));
    };

    const handleAddHighlight = () => {
        const trimmed = formHighlightInput.trim();
        if (trimmed && !formHighlights.includes(trimmed)) {
            setFormHighlights([...formHighlights, trimmed]);
            setFormHighlightInput("");
        }
    };

    const handleRemoveHighlight = (idx) => {
        setFormHighlights(formHighlights.filter((_, i) => i !== idx));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image file exceeds maximum 2MB threshold.");
                return;
            }
            setFormImageFile(file);
            setFormImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formName.trim() || !formSlugId.trim() || !formCodename.trim() || !formDescription.trim()) {
            toast.error("Required fields cannot be empty.");
            return;
        }

        if (formHighlights.length === 0) {
            toast.error("At least one highlight feature is required.");
            return;
        }

        const fd = new FormData();
        fd.append("name", formName);
        fd.append("slug_id", formSlugId);
        fd.append("codename", formCodename);
        fd.append("description", formDescription);
        fd.append("long_description", formLongDescription);
        fd.append("live_link", formLiveLink);
        fd.append("repo_link", formRepoLink);
        fd.append("category", formCategory);
        fd.append("featured", formFeatured);
        
        // Stringify lists for multipart parsing in serializer
        fd.append("tech_stack", JSON.stringify(formTechStack));
        fd.append("highlights", JSON.stringify(formHighlights));

        if (formImageFile) {
            fd.append("image", formImageFile);
        }

        const url = editingProject ? `/api/projects/${editingProject.id}/` : "/api/projects/";
        const method = editingProject ? "PUT" : "POST";

        try {
            const res = await apiFetch(url, {
                method,
                body: fd
            });

            if (res.ok) {
                const savedProject = await res.json();
                if (editingProject) {
                    setProjects(prev => prev.map(p => p.id === editingProject.id ? savedProject : p));
                    toast.success("Payload configuration updated.");
                } else {
                    setProjects(prev => [...prev, savedProject]);
                    toast.success("New payload successfully registered.");
                }
                setIsModalOpen(false);
            } else {
                const data = await res.json();
                toast.error(data.detail || "Validation check rejected by core server.");
            }
        } catch (err) {
            toast.error("Network error during compile operations.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <span className="font-display text-sm tracking-[0.3em] uppercase animate-pulse">
                    SYS.BOOT // Connecting to Core...
                </span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden hud-grid bg-background p-4">
                <div className="w-full max-w-md">
                    <HudCard label="SECURE_GATEWAY // AUTH_REQUIRED" variant="accent">
                        <form onSubmit={handleLogin} className="space-y-6 py-4">
                            <div className="flex justify-center text-primary animate-pulse">
                                <Lock size={40} />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1.5">
                                        OPERATOR_ID
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent hover:border-accent/40 rounded px-3 py-2.5 text-sm font-body text-foreground focus:outline-none transition-all duration-300 focus:shadow-[var(--glow-shadow-secondary)]"
                                        placeholder="Username"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1.5">
                                        ENCRYPTION_KEY
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent hover:border-accent/40 rounded px-3 py-2.5 text-sm font-body text-foreground focus:outline-none transition-all duration-300 focus:shadow-[var(--glow-shadow-secondary)]"
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full py-3 border border-primary bg-primary/10 text-primary font-display text-xs tracking-[0.25em] uppercase hover:bg-primary/20 hover:shadow-[var(--glow-shadow)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {authLoading ? "Decrypting..." : "Initiate Connection"}
                            </button>

                            <button 
                                type="button"
                                onClick={() => navigate("/")}
                                className="w-full flex items-center justify-center gap-1.5 text-[10px] font-display tracking-widest text-muted-foreground hover:text-foreground uppercase transition-colors pt-2"
                            >
                                <ArrowLeft size={10} /> Exit Terminal
                            </button>
                        </form>
                    </HudCard>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-display text-glow tracking-widest text-primary flex items-center gap-3">
                            <ShieldAlert size={28} /> System Control Console
                        </h1>
                        <p className="text-xs font-display text-muted-foreground tracking-[0.3em] uppercase mt-1">
                            SYS.ADMIN.PORTAL // Active Terminal Connection
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {activeTab !== "profile" && (
                            <button
                                onClick={() => {
                                    if (activeTab === "projects") openEditor();
                                    else if (activeTab === "skills") openSkillEditor();
                                    else if (activeTab === "missions") openMissionEditor();
                                    else if (activeTab === "certifications") openCertEditor();
                                    else if (activeTab === "categories") openCategoryEditor();
                                }}
                                className="px-5 py-2.5 border border-accent/60 bg-accent/10 text-accent font-display text-xs tracking-widest uppercase hover:bg-accent/20 hover:shadow-[var(--glow-shadow-accent)] transition-all duration-300 flex items-center gap-2"
                            >
                                <Plus size={14} />{" "}
                                {activeTab === "projects" ? "Add System" : 
                                 activeTab === "skills" ? "Add Capability" : 
                                 activeTab === "missions" ? "Add Mission" : 
                                 activeTab === "categories" ? "Add Category" : "Add Certification"}
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-5 py-2.5 border border-border bg-muted/20 text-muted-foreground font-display text-xs tracking-widest uppercase hover:bg-muted/40 hover:text-foreground transition-all duration-300 flex items-center gap-2"
                        >
                            <LogOut size={14} /> Terminate
                        </button>
                    </div>
                </div>

                {/* Tab selectors */}
                <div className="flex gap-4 border-b border-border/40 pb-1 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("projects")}
                        className={`pb-3 text-xs font-display tracking-widest uppercase border-b-2 transition-all duration-300 shrink-0 ${
                            activeTab === "projects"
                                ? "border-primary text-primary text-glow"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        System Projects
                    </button>
                    <button
                        onClick={() => setActiveTab("skills")}
                        className={`pb-3 text-xs font-display tracking-widest uppercase border-b-2 transition-all duration-300 shrink-0 ${
                            activeTab === "skills"
                                ? "border-primary text-primary text-glow"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Suit Capabilities
                    </button>
                    <button
                        onClick={() => setActiveTab("missions")}
                        className={`pb-3 text-xs font-display tracking-widest uppercase border-b-2 transition-all duration-300 shrink-0 ${
                            activeTab === "missions"
                                ? "border-primary text-primary text-glow"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Mission Logs
                    </button>
                    <button
                        onClick={() => setActiveTab("certifications")}
                        className={`pb-3 text-xs font-display tracking-widest uppercase border-b-2 transition-all duration-300 shrink-0 ${
                            activeTab === "certifications"
                                ? "border-primary text-primary text-glow"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Certifications
                    </button>
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`pb-3 text-xs font-display tracking-widest uppercase border-b-2 transition-all duration-300 shrink-0 ${
                            activeTab === "profile"
                                ? "border-primary text-primary text-glow"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        System Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={`pb-3 text-xs font-display tracking-widest uppercase border-b-2 transition-all duration-300 shrink-0 ${
                            activeTab === "categories"
                                ? "border-primary text-primary text-glow"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Project Categories
                    </button>
                </div>

                {/* Dashboard Table */}
                <HudCard label={activeTab === "projects" ? "Active Deployed Systems Catalog" : activeTab === "skills" ? "Suit Capabilities Diagnostic Matrix" : activeTab === "missions" ? "Mission Logs Chronological Timeline" : activeTab === "certifications" ? "Certifications & Upgrades Registry" : activeTab === "categories" ? "Project Categories Registry" : "System Diagnostics Overview Settings"}>
                    {activeTab === "projects" ? (
                        <div className="overflow-x-auto w-full pt-4">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-border/40 text-xs font-display tracking-widest text-muted-foreground uppercase">
                                        <th className="py-4 px-4">Codename</th>
                                        <th className="py-4 px-4">System Name</th>
                                        <th className="py-4 px-4">Category</th>
                                        <th className="py-4 px-4">Featured</th>
                                        <th className="py-4 px-4">Stack</th>
                                        <th className="py-4 px-4 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20 font-body text-sm">
                                    {projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="py-4 px-4 font-display font-semibold text-accent tracking-widest">
                                                {project.codename}
                                            </td>
                                            <td className="py-4 px-4 font-semibold text-foreground">
                                                {project.name}
                                            </td>
                                            <td className="py-4 px-4 text-muted-foreground uppercase text-xs font-display tracking-wider">
                                                {project.category}
                                            </td>
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() => handleToggleFeatured(project.id, project.featured)}
                                                    className={`px-3 py-1 border text-[10px] font-display tracking-widest uppercase transition-all duration-300 ${
                                                        project.featured 
                                                            ? 'border-secondary/60 bg-secondary/10 text-secondary' 
                                                            : 'border-border bg-muted/10 text-muted-foreground hover:border-muted-foreground/60'
                                                    }`}
                                                >
                                                    {project.featured ? "Featured" : "Standard"}
                                                </button>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-wrap gap-1.5 max-w-xs">
                                                    {project.tech_stack?.slice(0, 3).map((tech) => (
                                                        <span key={tech} className="px-2 py-0.5 border border-border/50 text-[10px] font-display text-muted-foreground">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {project.tech_stack?.length > 3 && (
                                                        <span className="text-[10px] font-display text-muted-foreground pl-1">
                                                            +{project.tech_stack.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditor(project)}
                                                    className="p-2 border border-border hover:border-accent hover:text-accent bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                    title="Edit configuration"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                
                                                {deleteConfirmId === project.id ? (
                                                    <div className="inline-flex items-center gap-1 bg-primary/20 border border-primary px-1.5 py-0.5 rounded animate-pulse">
                                                        <span className="text-[10px] font-display text-primary tracking-widest uppercase pr-1">Confirm Purge?</span>
                                                        <button 
                                                            onClick={() => handleDeleteProject(project.id)}
                                                            className="p-1 hover:text-primary transition-colors text-primary"
                                                            title="Delete permanently"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteConfirmId(null)}
                                                            className="p-1 hover:text-muted-foreground transition-colors text-muted-foreground"
                                                            title="Cancel purge"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirmId(project.id)}
                                                        className="p-2 border border-border hover:border-primary hover:text-primary bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                        title="Purge system"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {projects.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center text-muted-foreground font-display tracking-widest uppercase">
                                                NO DEPLOYED SYSTEMS FOUND IN CORE MATRIX.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === "skills" ? (
                        <div className="overflow-x-auto w-full pt-4">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-border/40 text-xs font-display tracking-widest text-muted-foreground uppercase">
                                        <th className="py-4 px-4">Capability Name</th>
                                        <th className="py-4 px-4">Category</th>
                                        <th className="py-4 px-4">Highlight Color</th>
                                        <th className="py-4 px-4 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20 font-body text-sm">
                                    {skills.map((skill) => (
                                        <tr key={skill.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="py-4 px-4 font-semibold text-foreground">
                                                {skill.name}
                                            </td>
                                            <td className="py-4 px-4 text-muted-foreground uppercase text-xs font-display tracking-wider">
                                                {skill.category}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-0.5 border text-[10px] font-display uppercase tracking-widest ${
                                                    skill.color === "primary" ? "border-primary bg-primary/10 text-primary" :
                                                    skill.color === "secondary" ? "border-secondary bg-secondary/10 text-secondary" :
                                                    "border-accent bg-accent/10 text-accent"
                                                }`}>
                                                    {skill.color}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openSkillEditor(skill)}
                                                    className="p-2 border border-border hover:border-accent hover:text-accent bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                    title="Edit configuration"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                
                                                {deleteSkillConfirmId === skill.id ? (
                                                    <div className="inline-flex items-center gap-1 bg-primary/20 border border-primary px-1.5 py-0.5 rounded animate-pulse">
                                                        <span className="text-[10px] font-display text-primary tracking-widest uppercase pr-1">Confirm Purge?</span>
                                                        <button 
                                                            onClick={() => handleDeleteSkill(skill.id)}
                                                            className="p-1 hover:text-primary transition-colors text-primary"
                                                            title="Delete permanently"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteSkillConfirmId(null)}
                                                            className="p-1 hover:text-muted-foreground transition-colors text-muted-foreground"
                                                            title="Cancel purge"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteSkillConfirmId(skill.id)}
                                                        className="p-2 border border-border hover:border-primary hover:text-primary bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                        title="Purge capability"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {skills.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-muted-foreground font-display tracking-widest uppercase">
                                                NO CAPABILITIES RECORDED IN SYSTEM CORE.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === "missions" ? (
                        <div className="overflow-x-auto w-full pt-4">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-border/40 text-xs font-display tracking-widest text-muted-foreground uppercase">
                                        <th className="py-4 px-4">Role</th>
                                        <th className="py-4 px-4">Organization</th>
                                        <th className="py-4 px-4">Period</th>
                                        <th className="py-4 px-4">Order</th>
                                        <th className="py-4 px-4 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20 font-body text-sm">
                                    {missions.map((mission) => (
                                        <tr key={mission.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="py-4 px-4 font-semibold text-foreground">
                                                {mission.role}
                                            </td>
                                            <td className="py-4 px-4 text-muted-foreground">
                                                {mission.organization}
                                            </td>
                                            <td className="py-4 px-4 text-secondary tracking-widest font-display text-xs">
                                                {mission.period}
                                            </td>
                                            <td className="py-4 px-4 font-display text-xs">
                                                {mission.order}
                                            </td>
                                            <td className="py-4 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openMissionEditor(mission)}
                                                    className="p-2 border border-border hover:border-accent hover:text-accent bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                    title="Edit configuration"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                
                                                {deleteMissionConfirmId === mission.id ? (
                                                    <div className="inline-flex items-center gap-1 bg-primary/20 border border-primary px-1.5 py-0.5 rounded animate-pulse">
                                                        <span className="text-[10px] font-display text-primary tracking-widest uppercase pr-1">Confirm Purge?</span>
                                                        <button 
                                                            onClick={() => handleDeleteMission(mission.id)}
                                                            className="p-1 hover:text-primary transition-colors text-primary"
                                                            title="Delete permanently"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteMissionConfirmId(null)}
                                                            className="p-1 hover:text-muted-foreground transition-colors text-muted-foreground"
                                                            title="Cancel purge"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteMissionConfirmId(mission.id)}
                                                        className="p-2 border border-border hover:border-primary hover:text-primary bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                        title="Purge mission log"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {missions.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-muted-foreground font-display tracking-widest uppercase">
                                                NO MISSION LOGS RECORDED IN TIMELINE CORE.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === "certifications" ? (
                        <div className="overflow-x-auto w-full pt-4">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-border/40 text-xs font-display tracking-widest text-muted-foreground uppercase">
                                        <th className="py-4 px-4">Title</th>
                                        <th className="py-4 px-4">Issuer</th>
                                        <th className="py-4 px-4">Status</th>
                                        <th className="py-4 px-4">Order</th>
                                        <th className="py-4 px-4 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20 font-body text-sm">
                                    {certifications.map((cert) => (
                                        <tr key={cert.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="py-4 px-4 font-semibold text-foreground">
                                                {cert.link ? (
                                                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline inline-flex items-center gap-1.5">
                                                        {cert.title} <ExternalLink size={12} className="shrink-0" />
                                                    </a>
                                                ) : (
                                                    cert.title
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-muted-foreground">
                                                {cert.issuer}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-0.5 border border-secondary/20 text-[10px] font-display text-secondary tracking-widest uppercase">
                                                    {cert.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-display text-xs">
                                                {cert.order}
                                            </td>
                                            <td className="py-4 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openCertEditor(cert)}
                                                    className="p-2 border border-border hover:border-accent hover:text-accent bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                    title="Edit configuration"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                
                                                {deleteCertConfirmId === cert.id ? (
                                                    <div className="inline-flex items-center gap-1 bg-primary/20 border border-primary px-1.5 py-0.5 rounded animate-pulse">
                                                        <span className="text-[10px] font-display text-primary tracking-widest uppercase pr-1">Confirm Purge?</span>
                                                        <button 
                                                            onClick={() => handleDeleteCert(cert.id)}
                                                            className="p-1 hover:text-primary transition-colors text-primary"
                                                            title="Delete permanently"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteCertConfirmId(null)}
                                                            className="p-1 hover:text-muted-foreground transition-colors text-muted-foreground"
                                                            title="Cancel purge"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteCertConfirmId(cert.id)}
                                                        className="p-2 border border-border hover:border-primary hover:text-primary bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                        title="Purge certification"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {certifications.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-muted-foreground font-display tracking-widest uppercase">
                                                NO UPGRADES LOGGED IN CERTIFICATIONS MATRIX.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === "categories" ? (
                        <div className="overflow-x-auto w-full pt-4">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-border/40 text-xs font-display tracking-widest text-muted-foreground uppercase">
                                        <th className="py-4 px-4">Category Name</th>
                                        <th className="py-4 px-4 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20 font-body text-sm">
                                    {categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="py-4 px-4 font-semibold text-foreground font-display tracking-wide">
                                                {cat.name}
                                            </td>
                                            <td className="py-4 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openCategoryEditor(cat)}
                                                    className="p-2 border border-border hover:border-accent hover:text-accent bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                    title="Modify category"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                {deleteCategoryConfirmId === cat.id ? (
                                                    <div className="inline-flex items-center gap-1 bg-primary/20 border border-primary px-1.5 py-0.5 rounded animate-pulse">
                                                        <span className="text-[10px] font-display text-primary tracking-widest uppercase pr-1">Confirm Purge?</span>
                                                        <button 
                                                            onClick={() => handleDeleteCategory(cat.id)}
                                                            className="p-1 hover:text-primary transition-colors text-primary"
                                                            title="Delete permanently"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteCategoryConfirmId(null)}
                                                            className="p-1 hover:text-muted-foreground transition-colors text-muted-foreground"
                                                            title="Cancel purge"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteCategoryConfirmId(cat.id)}
                                                        className="p-2 border border-border hover:border-primary hover:text-primary bg-muted/20 text-muted-foreground transition-all duration-300 rounded inline-flex"
                                                        title="Purge category"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="py-12 text-center text-muted-foreground font-display tracking-widest uppercase">
                                                NO CATEGORIES REGISTERED IN DATABASE.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveProfile} className="space-y-6 pt-4 px-1 max-h-[70vh] overflow-y-auto pr-2">
                            {/* Section 1: System Config & Brand */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-display text-accent tracking-widest uppercase border-b border-border/20 pb-2">1. System Config & Brand</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Logo Initials *
                                        </label>
                                        <input
                                            type="text"
                                            value={profileLogoInitials}
                                            onChange={(e) => setProfileLogoInitials(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="AG"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={profileFirstName}
                                            onChange={(e) => setProfileFirstName(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="Aniket"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={profileLastName}
                                            onChange={(e) => setProfileLastName(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="Goyal"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Hero Tagline & Subtitles */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-display text-accent tracking-widest uppercase border-b border-border/20 pb-2">2. Hero Tagline & Headings</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Hero Tagline (Regular Part) *
                                        </label>
                                        <input
                                            type="text"
                                            value={profileHeroTitleP1}
                                            onChange={(e) => setProfileHeroTitleP1(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="I don't just build projects. "
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Hero Tagline (Glow Part) *
                                        </label>
                                        <input
                                            type="text"
                                            value={profileHeroTitleP2}
                                            onChange={(e) => setProfileHeroTitleP2(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="I engineer systems."
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                        Hero Roles/Subtitles *
                                    </label>
                                    <input
                                        type="text"
                                        value={profileHeroSubtitle}
                                        onChange={(e) => setProfileHeroSubtitle(e.target.value)}
                                        className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                        placeholder="Full Stack Developer · Systems Engineer"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Section 3: Biography Copy */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-display text-accent tracking-widest uppercase border-b border-border/20 pb-2">3. Biography Copy</h3>
                                <div>
                                    <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                        Biography Paragraph 1 *
                                    </label>
                                    <textarea
                                        value={profileBioP1}
                                        onChange={(e) => setProfileBioP1(e.target.value)}
                                        rows={3}
                                        className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300 resize-none"
                                        placeholder="First paragraph of bio..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                        Biography Paragraph 2
                                    </label>
                                    <textarea
                                        value={profileBioP2}
                                        onChange={(e) => setProfileBioP2(e.target.value)}
                                        rows={3}
                                        className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300 resize-none"
                                        placeholder="Second paragraph of bio..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Diagnostics: Stack
                                        </label>
                                        <input
                                            type="text"
                                            value={profileStack}
                                            onChange={(e) => setProfileStack(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. MERN"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Diagnostics: Experience
                                        </label>
                                        <input
                                            type="text"
                                            value={profileExperience}
                                            onChange={(e) => setProfileExperience(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Full Stack — 1 yr projects"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Diagnostics: Availability
                                        </label>
                                        <input
                                            type="text"
                                            value={profileAvailability}
                                            onChange={(e) => setProfileAvailability(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Open to internships"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Diagnostics: Status
                                        </label>
                                        <input
                                            type="text"
                                            value={profileStatus}
                                            onChange={(e) => setProfileStatus(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Active"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-border/20">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Owner Notification Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={profileOwnerEmail}
                                            onChange={(e) => setProfileOwnerEmail(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. your-email@gmail.com"
                                            required
                                        />
                                        <span className="text-[9px] text-muted-foreground mt-1 block">This email receives new message notifications.</span>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Sender Confirmation/From Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={profileDefaultFromEmail}
                                            onChange={(e) => setProfileDefaultFromEmail(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. your-email@gmail.com"
                                            required
                                        />
                                        <span className="text-[9px] text-muted-foreground mt-1 block">This is used as the 'From' address for confirmations.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={profileLoading}
                                    className="px-6 py-2.5 border border-accent bg-accent/10 text-accent font-display text-xs tracking-widest uppercase hover:bg-accent/20 hover:shadow-[var(--glow-shadow-accent)] transition-all duration-300 disabled:opacity-50"
                                >
                                    {profileLoading ? "Saving Settings..." : "Save Diagnostic Profile"}
                                </button>
                            </div>
                        </form>
                    )}
                </HudCard>
                
                <div className="pt-4 text-center">
                    <button 
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-1.5 text-xs font-display tracking-widest text-muted-foreground hover:text-foreground uppercase transition-colors"
                    >
                        <ArrowLeft size={12} /> Return to Public Dashboard
                    </button>
                </div>
            </div>

            {/* Project Editor Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-3xl my-8">
                        <HudCard label={editingProject ? `System Edit // ${formCodename}` : "System Registration // New Payload"}>
                            <form onSubmit={handleSave} className="space-y-6 pt-4 max-h-[80vh] overflow-y-auto px-1">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            System Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="System name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            System Slug ID (Unique Path) *
                                        </label>
                                        <input
                                            type="text"
                                            value={formSlugId}
                                            onChange={(e) => setFormSlugId(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="slug-path-id"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Codename (e.g. SYS-006) *
                                        </label>
                                        <input
                                            type="text"
                                            value={formCodename}
                                            onChange={(e) => setFormCodename(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="SYS-XXX"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Category *
                                        </label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            required
                                        >
                                            <option value="" disabled className="bg-background">-- Select Category --</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name} className="bg-background">{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Live Link URL
                                        </label>
                                        <input
                                            type="text"
                                            value={formLiveLink}
                                            onChange={(e) => setFormLiveLink(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="#"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Repository Link URL
                                        </label>
                                        <input
                                            type="text"
                                            value={formRepoLink}
                                            onChange={(e) => setFormRepoLink(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="#"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                        Short Description *
                                    </label>
                                    <textarea
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        rows={2}
                                        className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300 resize-none"
                                        placeholder="Short summary for project grid card..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                        Long Description / Purpose Detail
                                    </label>
                                    <textarea
                                        value={formLongDescription}
                                        onChange={(e) => setFormLongDescription(e.target.value)}
                                        rows={4}
                                        className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300 resize-none"
                                        placeholder="Detailed background and architecture descriptions..."
                                    />
                                </div>

                                {/* Tech stack Chip List Builder */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block">
                                        Technology Stack
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formTechInput}
                                            onChange={(e) => setFormTechInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                            className="flex-1 bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none"
                                            placeholder="Enter technology (e.g. React.js) and press Enter or add"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTech}
                                            className="px-4 py-2 border border-border bg-muted/20 text-xs font-display tracking-widest uppercase hover:bg-muted/40 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {formTechStack.map((tech) => (
                                            <span key={tech} className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-accent/40 bg-accent/5 rounded text-xs font-display text-accent">
                                                {tech}
                                                <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:text-primary transition-colors">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                        {formTechStack.length === 0 && (
                                            <span className="text-xs text-muted-foreground italic font-body">No technologies added yet.</span>
                                        )}
                                    </div>
                                </div>

                                {/* Highlights/Features List Builder */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block">
                                        System Features & Highlights * (Minimum 1 Required)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formHighlightInput}
                                            onChange={(e) => setFormHighlightInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                                            className="flex-1 bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none"
                                            placeholder="Enter system capability highlight..."
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddHighlight}
                                            className="px-4 py-2 border border-border bg-muted/20 text-xs font-display tracking-widest uppercase hover:bg-muted/40 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <ul className="space-y-2 pt-1 font-body text-sm text-foreground">
                                        {formHighlights.map((highlight, idx) => (
                                            <li key={idx} className="flex items-center justify-between gap-3 p-2 bg-muted/20 border border-border/30 rounded">
                                                <span className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-accent shrink-0" />
                                                    {highlight}
                                                </span>
                                                <button type="button" onClick={() => handleRemoveHighlight(idx)} className="text-muted-foreground hover:text-primary transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </li>
                                        ))}
                                        {formHighlights.length === 0 && (
                                            <li className="text-xs text-muted-foreground italic">No system highlights configured.</li>
                                        )}
                                    </ul>
                                </div>

                                {/* File Upload */}
                                <div className="grid md:grid-cols-2 gap-4 items-center border-t border-border/20 pt-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1.5">
                                            Upload System Image / Diagram (Max 2MB)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border file:border-border file:bg-muted/20 file:text-xs file:font-display file:tracking-widest file:uppercase file:text-muted-foreground hover:file:bg-muted/40 file:cursor-pointer"
                                        />
                                    </div>
                                    {formImagePreview && (
                                        <div className="flex flex-col items-center p-2 bg-muted/10 border border-border/30 rounded max-w-xs justify-self-center">
                                            <span className="text-[9px] font-display text-muted-foreground uppercase tracking-widest mb-1.5">Preview Matrix</span>
                                            <img src={formImagePreview} alt="Upload preview" className="max-h-24 max-w-full object-contain border border-border/50" />
                                        </div>
                                    )}
                                </div>

                                {/* Featured Toggle */}
                                <div className="flex items-center gap-3 border-t border-border/20 pt-4">
                                    <input
                                        type="checkbox"
                                        id="featuredToggle"
                                        checked={formFeatured}
                                        onChange={(e) => setFormFeatured(e.target.checked)}
                                        className="w-4 h-4 bg-muted/30 border border-border accent-secondary cursor-pointer"
                                    />
                                    <label htmlFor="featuredToggle" className="text-xs font-display tracking-widest uppercase text-foreground/90 cursor-pointer select-none">
                                        Feature on Primary HUD Overview
                                    </label>
                                </div>

                                {/* Submit Actions */}
                                <div className="flex justify-end gap-3 border-t border-border/20 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 border border-border bg-muted/20 text-muted-foreground font-display text-xs tracking-widest uppercase hover:bg-muted/40 hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 border border-accent bg-accent/10 text-accent font-display text-xs tracking-widest uppercase hover:bg-accent/20 hover:shadow-[0_0_20px_rgba(0,195,255,0.3)] transition-all duration-300"
                                    >
                                        Save Configuration
                                    </button>
                                </div>
                            </form>
                        </HudCard>
                    </div>
                </div>
            )}

            {/* Skill Editor Modal Overlay */}
            {isSkillModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-md my-8">
                        <HudCard label={editingSkill ? "Capability Config // Edit Record" : "Capability Config // Log New System"}>
                            <form onSubmit={handleSaveSkill} className="space-y-6 pt-4 px-1">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Capability Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={skillName}
                                            onChange={(e) => setSkillName(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Django, Next.js, Git"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Category *
                                        </label>
                                        <input
                                            type="text"
                                            value={skillCategory}
                                            onChange={(e) => setSkillCategory(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Programming Languages, Full Stack, Databases"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Highlight Color / Visual Signature *
                                        </label>
                                        <select
                                            value={skillColor}
                                            onChange={(e) => setSkillColor(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                        >
                                            <option value="accent" className="bg-background">Accent (Blue)</option>
                                            <option value="primary" className="bg-background">Primary (Red)</option>
                                            <option value="secondary" className="bg-background">Secondary (Gold)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Submit Actions */}
                                <div className="flex justify-end gap-3 border-t border-border/20 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsSkillModalOpen(false)}
                                        className="px-5 py-2.5 border border-border bg-muted/20 text-muted-foreground font-display text-xs tracking-widest uppercase hover:bg-muted/40 hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 border border-accent bg-accent/10 text-accent font-display text-xs tracking-widest uppercase hover:bg-accent/20 hover:shadow-[var(--glow-shadow-accent)] transition-all duration-300"
                                    >
                                        Save Record
                                    </button>
                                </div>
                            </form>
                        </HudCard>
                    </div>
                </div>
            )}
            {/* Category Editor Modal Overlay */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-md my-8">
                        <HudCard label={editingCategory ? "Category Config // Edit Record" : "Category Config // Create New"}>
                            <form onSubmit={handleSaveCategory} className="space-y-6 pt-4 px-1">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Category Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Mobile, DevOps, AI/ML"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-border/20 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryModalOpen(false)}
                                        className="px-4 py-2 border border-border hover:border-accent/40 text-muted-foreground hover:text-foreground font-display text-xs tracking-widest uppercase transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-accent/20 border border-accent text-accent font-display text-xs tracking-widest uppercase hover:bg-accent/30 transition-all duration-300"
                                    >
                                        Synchronize
                                    </button>
                                </div>
                            </form>
                        </HudCard>
                    </div>
                </div>
            )}

            {/* Mission Log Editor Modal Overlay */}
            {isMissionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-md my-8">
                        <HudCard label={editingMission ? "Mission Log Config // Edit Mission" : "Mission Log Config // Log New Mission"}>
                            <form onSubmit={handleSaveMission} className="space-y-6 pt-4 px-1">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Role / Position Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={missionRole}
                                            onChange={(e) => setMissionRole(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Full Stack Developer Intern"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Organization / Company *
                                        </label>
                                        <input
                                            type="text"
                                            value={missionOrg}
                                            onChange={(e) => setMissionOrg(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Tech Organization"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                                Period *
                                            </label>
                                            <input
                                                type="text"
                                                value={missionPeriod}
                                                onChange={(e) => setMissionPeriod(e.target.value)}
                                                className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                                placeholder="e.g. 2026"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                                Order Parameter
                                            </label>
                                            <input
                                                type="number"
                                                value={missionOrder}
                                                onChange={(e) => setMissionOrder(e.target.value)}
                                                className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Contributions (One per line)
                                        </label>
                                        <textarea
                                            value={missionContributions}
                                            onChange={(e) => setMissionContributions(e.target.value)}
                                            rows={5}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="Developed RESTful APIs...&#10;Implemented access control..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-border/20 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsMissionModalOpen(false)}
                                        className="px-5 py-2.5 border border-border bg-muted/20 text-muted-foreground font-display text-xs tracking-widest uppercase hover:bg-muted/40 hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 border border-accent bg-accent/10 text-accent font-display text-xs tracking-widest uppercase hover:bg-accent/20 hover:shadow-[var(--glow-shadow-accent)] transition-all duration-300"
                                    >
                                        Save Mission
                                    </button>
                                </div>
                            </form>
                        </HudCard>
                    </div>
                </div>
            )}

            {/* Certification Editor Modal Overlay */}
            {isCertModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-md my-8">
                        <HudCard label={editingCert ? "Certification Config // Edit Upgrade" : "Certification Config // Log New Upgrade"}>
                            <form onSubmit={handleSaveCert} className="space-y-6 pt-4 px-1">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Upgrade / Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={certTitle}
                                            onChange={(e) => setCertTitle(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Meta Front-End Developer Certificate"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Issuer / Org *
                                        </label>
                                        <input
                                            type="text"
                                            value={certIssuer}
                                            onChange={(e) => setCertIssuer(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. Coursera"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                                Status *
                                            </label>
                                            <input
                                                type="text"
                                                value={certStatus}
                                                onChange={(e) => setCertStatus(e.target.value)}
                                                className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                                placeholder="UNLOCKED"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                                Order Parameter
                                            </label>
                                            <input
                                                type="number"
                                                value={certOrder}
                                                onChange={(e) => setCertOrder(e.target.value)}
                                                className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-display text-muted-foreground tracking-widest uppercase block mb-1">
                                            Verification Link / URL
                                        </label>
                                        <input
                                            type="text"
                                            value={certLink}
                                            onChange={(e) => setCertLink(e.target.value)}
                                            className="w-full bg-muted/30 border border-muted-foreground/30 focus:border-accent rounded px-3 py-2 text-sm font-body text-foreground focus:outline-none transition-all duration-300"
                                            placeholder="e.g. https://credly.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-border/20 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCertModalOpen(false)}
                                        className="px-5 py-2.5 border border-border bg-muted/20 text-muted-foreground font-display text-xs tracking-widest uppercase hover:bg-muted/40 hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 border border-accent bg-accent/10 text-accent font-display text-xs tracking-widest uppercase hover:bg-accent/20 hover:shadow-[var(--glow-shadow-accent)] transition-all duration-300"
                                    >
                                        Save Certification
                                    </button>
                                </div>
                            </form>
                        </HudCard>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
