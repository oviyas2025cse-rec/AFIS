import JSZip from 'jszip';
import { JAVA_PROJECT_FILES } from '../data/projectFiles';

/**
 * Packages the entire Java 21 / Maven WAR project into a downloadable ZIP archive.
 */
export async function downloadJavaMavenZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('afis-academic-flow-system');

  if (!rootFolder) return;

  for (const [relativePath, content] of Object.entries(JAVA_PROJECT_FILES)) {
    rootFolder.file(relativePath, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'afis-java21-maven-tomcat-project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
