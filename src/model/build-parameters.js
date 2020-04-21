import Platform from './platform';

class BuildParameters {
  static create(parameters) {
    const {
      unityVersion,
      targetPlatform,
      projectPath,
      buildName,
      buildsPath,
      buildMethod,
      customParameters,
    } = parameters;

    return {
      version: unityVersion,
      platform: targetPlatform,
      projectPath,
      buildName,
      buildPath: `${buildsPath}/${targetPlatform}`,
      buildFile: this.parseBuildFile(buildName, targetPlatform, customParameters),
      buildMethod,
      customParameters,
    };
  }

  static parseBuildFile(filename, platform, customParameters) {
    if (Platform.isWindows(platform)) {
      return `${filename}.exe`;
    }

    if (Platform.isAndroid(platform)) {
      let extension = 'apk';

      const parameters = customParameters.split(' ');

      // eslint-disable-next-line no-restricted-syntax
      for (const [index, string] of parameters.entries()) {
        if (string.includes('buildAppBundle') && parameters[index + 1] === 'true') {
          extension = 'aab';
          break;
        }
      }

      return `${filename}.${extension}`;
    }

    return filename;
  }
}

export default BuildParameters;
