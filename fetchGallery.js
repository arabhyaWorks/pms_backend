const mysql = require("mysql2/promise");

const fetchProjectGallery = async (pool) => {
  const query = `
    SELECT 
        p.id AS projectId,
        p.project_name AS projectName,
        p.executing_agency_id AS executiveAgencyId,
        p.executing_agency AS executiveAgencyName,
        p.department_id AS departmentId,
        p.project_department AS departmentName,
        g.id AS galleryId,
        g.image,
        g.image_description AS imageDescription,
        g.time AS uploadedAt
    FROM 
        projects p
    LEFT JOIN 
        project_gallery g 
    ON 
        p.id = g.project_id
  `;

  try {
    const [rows] = await pool.query(query);

    const projects = rows.reduce((acc, row) => {
      const existingProject = acc.find((p) => p.projectId === row.projectId);

      if (existingProject) {
        if (row.galleryId) {
          existingProject.gallery.push({
            image: row.image,
            imageDescription: row.imageDescription,
            uploadedAt: row.uploadedAt,
          });
        }
      } else {
        acc.push({
          projectId: row.projectId,
          projectName: row.projectName,
          executiveAgencyId: row.executiveAgencyId,
          executiveAgencyName: row.executiveAgencyName,
          departmentId: row.departmentId,
          departmentName: row.departmentName,
          gallery: row.galleryId
            ? [
                {
                  image: row.image,
                  imageDescription: row.imageDescription,
                  uploadedAt: row.uploadedAt,
                },
              ]
            : [],
        });
      }

      return acc;
    }, []);

    // Sort projects to prioritize those with gallery entries
    projects.sort((a, b) => b.gallery.length - a.gallery.length);

    return projects;
  } catch (error) {
    console.error("Error in fetchProjectGallery:", error.message);
    throw error;
  }
};

module.exports = { fetchProjectGallery };