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
      repository,
      dockerImageName,
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
      repository,
      dockerImageName,
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
          // env name is not a known constant at this stage
          // eslint-disable-next-line dot-notation
          process.env['BUILD_APP_BUNDLE'] = 'true';
          extension = 'aab';
          break;
        } else {
          // env name is not a known constant at this stage
          // eslint-disable-next-line dot-notation
          process.env['BUILD_APP_BUNDLE'] = 'false';
        }
      }

      return `${filename}.${extension}`;
    }

    return filename;
  }
}

export default BuildParameters;
