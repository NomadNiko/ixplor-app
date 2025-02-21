import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

interface ExperienceCardProps {
  period: string;
  role: string;
  company?: string;
  description: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  period,
  role, 
  company,
  description
}) => (
  <Card sx={{ 
    mb: 3,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0, 
      bottom: 0,
      width: 4,
      bgcolor: 'primary.main',
      borderTopLeftRadius: 1,
      borderBottomLeftRadius: 1
    }
  }}>
    <CardContent>
      <Typography variant="overline" color="text.secondary" gutterBottom>
        {period}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {role}
      </Typography>
      {company && (
        <Typography color="text.secondary" gutterBottom>
          {company}
        </Typography>
      )}
      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default function ResumeSection() {
  const experiences = [
    {
      period: "Jun 17 - Oct 19", 
      role: "Lead Site Operations Engineer",
      company: "SigFig/WikiInvest Inc.",
      description: `
- Manage a team of six Site Ops Engineers
- Administer Linux servers with Red Hat 
- Configure systems with Puppet
- Monitor systems using Nagios, New Relic, and Runscope
- Control source code with Git and Gerrit
- Manage Java application logs with ELK Stack and Splunk
      `
    },
    {
      period: "Oct 15 - May 17",
      role: "Associate DevOps Engineer / Cloud Engineer", 
      company: "Bottomline Technologies",
      description: `
- Administer virtual and physical server farms with VMware
- Manage Linux servers with Red Hat, CentOS, AIX, and SUN
- Administer Jenkins for Master/Slave VM server configuration, upgrades, and job creation/maintenance
- Configure systems with Puppet
- Monitor systems using Nagios, OEM, and Lansweeper Scanner
- Control source code with Git, Stash, CollabNet SVN, and Wush.net SVN
- Perform production releases/upgrades of digital banking applications via Jenkins
- Administer SFTP automation with GoAnywhere MFT
- Install and configure Java applications with WebLogic via WLST 
- Manage databases with Oracle and MySQL
- Script application configuration with Bash, PowerShell, Capistrano, and Python
- Provision application pods/stacks with Cloudbolt and PowerCLI
      `
    },
    {   
      period: "Apr 13 - Oct 15",
      role: "Service Desk Analyst / Helpdesk Technician / Operations Analyst / Jr. Linux Administrator",
      company: "Andera (now Bottomline)",
      description: `
- Build out, image, and deploy laptops
- Triage and administer trouble tickets
- Manage SAAS applications (third-party outsourced applications) 
- Administer SAAS systems (internal production system management)
- Manage ShoreTel phone system administration
- Perform system administration
- Manage door card system administration
- Manage Subversion servers (internal and external)
- Perform asset management
- Manage vendors
- Administer laptop encryption
- Install and manage SSL certificates and keystores for SAAS custom URL branding
- Administer Red Hat Linux servers
- Troubleshoot customer issues within SLAs
- Have limited exposure to MySQL
      `
    },
    {
      period: "May 11 - Nov 12",
      role: "System Support Analyst",
      company: "CVS Pharmacies Inc.",  
      description: `
- Answered incoming calls from CVS personnel across the US for system support issues 
- Troubleshoot customer issues within SLAs
- Escalated issues that could not be resolved on the first call
      `
    },
    {
      period: "Sep 06 - Apr 11",
      role: "Cyber System Operations",  
      company: "United States Air Force",
      description: `
- System Administrator within configuration management - 1 Year
- On-Site Technical Support - 1 Year  
- Help Desk/NOC Technical Support - 2 ½ Years
      `
    }
  ];

  const skills = [
    {
      category: "Operating Systems",
      items: ["Linux (Red Hat, CentOS, Ubuntu)", "AIX", "Sun Solaris", "Windows"]
    },
    {
      category: "Server Administration",
      items: ["Virtualization (VMware)", "Linux server administration", "Server farm administration"]
    },
    {
      category: "Database Administration",
      items: ["Oracle", "MySQL"]
    },
    {
      category: "Application Servers",
      items: ["WebLogic", "Apache Tomcat"]
    },
    {
      category: "Configuration Management",
      items: ["Puppet", "Ansible"]
    },
    {
      category: "System Monitoring",
      items: ["Nagios", "New Relic", "OEM", "Rackspace", "Runscope"]
    },
    {
      category: "Source Control",
      items: ["Git", "Gerrit", "SVN"]
    },
    {
      category: "Scripting & Automation",
      items: ["Bash", "PowerShell", "Python", "Capistrano", "GoAnywhere MFT", "WLST", "CloudBolt", "PowerCLI"]
    },
    {
      category: "Application Management",
      items: ["Java applications (ELK stack, Splunk)", "Digital banking applications (Jenkins)", "SaaS applications"]
    },
    {
      category: "Troubleshooting & Technical Support",
      items: ["Ticket triage", "Customer issue troubleshooting within SLAs", "On-site technical support", "Help desk technical support"] 
    },
    {
      category: "Management & Administration",
      items: ["Team management", "Vendor management", "Asset management"]
    },
    {
      category: "Other Skills",
      items: ["Laptop build out, imaging, and deployment", "SAAS administration", "Shoretel phone systems", "Door card systems", "SSL certificate/keystore installation and management", "Limited exposure to MySQL"]
    },
    {
      category: "Programming",
      items: ["C#", "TypeScript", "JavaScript", "Python", "Bash"]
    },
    {
      category: "Web Development", 
      items: ["React", "Node.js", "Next.js", "MongoDB", "REST APIs"]
    },
    {
      category: "Game Development",
      items: ["Unity", "C#", "Game Design", "3D Modeling", "Asset Creation"] 
    }
  ];
        
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Experience
          </Typography>
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} {...exp} />  
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ 
            position: 'sticky',
            top: 24,
            bgcolor: 'background.paper', 
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            {skills.map((skillGroup, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {skillGroup.category}  
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skillGroup.items.map((skill, i) => (
                    <Box
                      key={i}  
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: 'background.glass',
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {skill}
                    </Box>
                  ))}
                </Box>
                {index < skills.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}