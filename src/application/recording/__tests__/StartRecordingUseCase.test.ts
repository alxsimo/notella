import { StartRecordingUseCase } from '../StartRecordingUseCase';
import { AudioCaptureService } from '@domain/recording/AudioCaptureService';
import { RecordingRepository } from '@domain/recording/RecordingRepository';

describe('StartRecordingUseCase', () => {
  let mockAudioCaptureService: jest.Mocked<AudioCaptureService>;
  let mockRecordingRepository: jest.Mocked<RecordingRepository>;
  let useCase: StartRecordingUseCase;

  beforeEach(() => {
    mockAudioCaptureService = {
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn(),
      isRecording: jest.fn().mockReturnValue(false),
    };

    mockRecordingRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new StartRecordingUseCase(
      mockAudioCaptureService,
      mockRecordingRepository
    );
  });

  it('should start recording and save to repository', async () => {
    const command = {
      title: 'Team Meeting',
      outputDirectory: '/recordings',
    };

    const recordingId = await useCase.execute(command);

    expect(recordingId).toBeDefined();
    expect(mockAudioCaptureService.start).toHaveBeenCalled();
    expect(mockRecordingRepository.save).toHaveBeenCalled();
  });

  it('should throw error if already recording', async () => {
    mockAudioCaptureService.isRecording.mockReturnValue(true);

    const command = {
      title: 'Team Meeting',
      outputDirectory: '/recordings',
    };

    await expect(useCase.execute(command)).rejects.toThrow(
      'A recording is already in progress'
    );
  });

  it('should use correct audio configuration', async () => {
    const command = {
      title: 'Test',
      outputDirectory: '/test',
    };

    await useCase.execute(command);

    expect(mockAudioCaptureService.start).toHaveBeenCalledWith(
      expect.objectContaining({
        sampleRate: 44100,
        channels: 2,
        format: 'wav',
      })
    );
  });
});
